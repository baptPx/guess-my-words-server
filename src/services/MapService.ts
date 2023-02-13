import { Op } from "sequelize";
import { addPoint } from "../dto/AddPoint";
import { createMap, CreateMapInputDTO, CreateMapOutputDTO } from "../dto/CreateMap"
import { addAnswer } from "../dto/PlayPoint";
import { MapAnswer } from "../models/MapAnswer";
import { MapPoint } from "../models/MapPoint";
import { MapToGuess } from "../models/MapToGuess";
import { User } from "../models/User"
const config = require('../config');

const uploadMap = async (body: any, file: any, user: User): Promise<CreateMapOutputDTO> => {
    const request: CreateMapInputDTO = await createMap.validate(body)

    if(!file) {
        throw({ error: "The file 'map' is missing"})
    }
    if(!config.MIMETYPE_MAP_ALLOWED.includes(file.mimetype)) {
        throw({ error: 'Mime type not allowed', status: 415})
    }
    const fileName = crypto.randomUUID() + '.png'
    file.mv('maps/' + fileName)
    const createdMap = await MapToGuess.create({
        title: request.title,
        description: request.description,
        fileName,
        userId: user.id
    } as MapToGuess)
    return createdMap
}
const getMapForUser = async(mapId: number, user: User) => {
    const map = await MapToGuess.findOne({
        where: { id: mapId },
        include: [MapPoint]
    })
    if (map?.dataValues.userId !== user.id) {
        throw({error: 'This map doesn\'t belong to the logged user' })
    }
    return map
}

const addPointToMap = async(body: any, mapId: number, user: User) => {
    const [request, mayBeMap] = await Promise.all([
        addPoint.validate(body),
        MapToGuess.findOne({
            where: {
                id: mapId,
                userId: user.id
            }
        })
    ])
    if(!mayBeMap) {
        throw({ message: "Map not find or doesn't belong to user" })
    }
    const { x, y, width, label, possibleAnswers } = request
    return await MapPoint.create({
        mapId,
        x,
        y,
        width,
        label,
        possibleAnswers
    } as  MapPoint)
}

const editPoint = async(body: any, pointId: number, user: User) => {
    const [request, mayBePoint] = await Promise.all([
        addPoint.validate(body),
        MapPoint.findOne({
            where: {
                id: pointId
            }
        })
    ])
    const map = MapToGuess.findOne({
        where: { 
            id: mayBePoint?.mapId,
            userId: user.id
        }
    })
    if(!mayBePoint || !map) {
        throw({ message: "Point not find or doesn't belong to user" })
    }
    const { x, y, width } = request
    return await mayBePoint.update({
        x,
        y,
        width
    } as MapPoint)
}
const deletePoint = async(body: any, pointId: number, user: User) => {
    const mayBePoint = await MapPoint.findOne({
            where: {
                id: pointId
            }
        })
    
    const map = MapToGuess.findOne({
        where: { 
            id: mayBePoint?.mapId,
            userId: user.id
        }
    })
    if(!mayBePoint || !map) {
        throw({ message: "Point not find or doesn't belong to user" })
    }
    return await MapPoint.destroy({
        where: { id: pointId}
    })
}

const getPlayDataForMap = async(mapId: number, user: User) => {
    let [points, map] = await Promise.all([
        await MapPoint.findAll({
            attributes: ['x', 'y', 'width', 'id'],
            where: { mapId }
        }),
        MapToGuess.findOne({
            where: { id: mapId }
        })
    ])
    if(!map) {
        throw({error: 'The map with id ' + mapId + ' doesn\'t exist'})
    }
    const pointsId = points.map(point => {
        return point.dataValues.id
    })
    const nbPoints = pointsId.length
    const answers = await MapAnswer.findAll({
        where: { 
            mapPointId: { [Op.or]: pointsId },
            userId: user.id
        },
        include: [MapPoint]
    })
    let result = points.map(point => {
        const pointAnsweredIndex = answers.findIndex(p => p.mapPointId === point.id)
        if(pointAnsweredIndex !== -1) return {...answers[pointAnsweredIndex].mapPoint.dataValues, find: true}
        else return {...point.dataValues, find: false}
    })
    const {title, description, fileName} = map?.dataValues
    return {title, description, fileName, nbPoints, points: result}
}

const tryAnswerOnMap = async(body: any, pointId: number, mapId: number, user: User) => {
    const [request, point] = await Promise.all([
        addAnswer.validate(body),
        MapPoint.findOne({
            where: { id: pointId }
        })
    ])
    if(!point) {
        throw({error: 'point not find'})
    }
    const {answer} = request
    
    const isAnswerOK = answer.match(point?.possibleAnswers) 

    if(!isAnswerOK) {
        return { correct: false }
    } else {
        const userId = res.locals?.id
        const answerExist = await MapAnswer.findOne({
            where: { userId, mapPointId: pointId}
        })
        if(!answerExist) {
            MapAnswer.create({
                mapPointId: pointId,
                userId
            } as MapAnswer)
        }
        return { correct: true, label: point.label }
    }
}
module.exports = {
    getMapForUser,
    uploadMap,
    addPointToMap,
    editPoint,
    deletePoint,
    getPlayDataForMap,
    tryAnswerOnMap
}
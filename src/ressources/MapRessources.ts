import {NextFunction, Request, Response} from 'express'
import { Op } from 'sequelize'
import { addPoint, AddPointRequestDTO } from '../dto/AddPoint'
import { createMap, CreateMapDTO } from '../dto/CreateMap'
import { addAnswer } from '../dto/PlayPoint'
import { MapAnswer } from '../models/MapAnswer'
import { MapPoint } from '../models/MapPoint'
import { MapToGuess } from '../models/MapToGuess'
const express = require('express')
const app = express()
const crypto = require('crypto')
const config = require('../config')
const auth = require('../middlewares/auth')

app.post('/', [auth.verifyToken], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = req.files['map']
        if(!file) {
            return res.status(400).send({ message: "The file 'map' is missing"})
        }
        let request: CreateMapDTO = await createMap.validate(req.body)
        if(!config.MIMETYPE_MAP_ALLOWED.includes(file.mimetype)) {
            return res.status(415).send({ message: 'Mime type not allowed'})
        }
        const randomUUID = crypto.randomUUID()
        file.mv('maps/' + randomUUID + '.png')
        const createdMap = await MapToGuess.create({
            title: request.title,
            description: request.description,
            fileName: randomUUID,
            userId: req.user ? req.user.id : -1
        } as MapToGuess)
        return res.status(201).send(createdMap)
    } catch(err) {
        next(err)
    }
})
app.get('/edits', [auth.verifyToken], async (req: Request, res: Response, next: NextFunction) => {

    let map = await MapToGuess.findAll({
        where: { userId: req.user?.id }
    })
    return res.send(map)
})

app.get('/', async (req: Request, res: Response, next: NextFunction) => {

    let map = await MapToGuess.findAll()
    return res.send(map)
})
app.get('/:mapId/edit', [auth.verifyToken], async (req: Request, res: Response, next: NextFunction) => {
    const {mapId} = req.params

    let map = await MapToGuess.findOne({
        where: { id: mapId },
        include: [MapPoint]
    })
    if (map?.dataValues.userId !== req.user?.id) {
        return res.status(400).send({error: 'This map doesn\'t belong to the logged user' })
    }
    res.send(map)
})

app.post('/:mapId/edit', [auth.verifyToken], async (req: Request, res: Response, next: NextFunction) => {
    try {
        let mapId: number = +req.params.mapId
        const [request, mayBeMap] = await Promise.all([
            addPoint.validate(req.body),
            MapToGuess.findOne({
                where: {
                    id: mapId,
                    userId: req.user ? req.user.id : 0 
                }
            })
        ])
        if(!mayBeMap) {
            return res.status(400).send({ message: "Map not find or doesn't belong to user" })
        }
        const { x, y, width, label, possibleAnswers } = request
        let point = await MapPoint.create({
            mapId,
            x,
            y,
            width,
            label,
            possibleAnswers
        } as  MapPoint)
        return res.send(point)
    
    } catch(err) {
        next(err)
    }
})



app.patch('/:mapId/points/:pointId', [auth.verifyToken], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {mapId, pointId} = req.params
        const [request, mayBePoint] = await Promise.all([
            addPoint.validate(req.body),
            MapPoint.findOne({
                where: {
                    id: pointId,
                    mapId 
                }
            })
        ])
        const map = MapToGuess.findOne({
            where: { 
                id: mayBePoint?.mapId,
                userId: req.user?.id
            }
        })
        if(!mayBePoint || !map) {
            return res.status(400).send({ message: "Point not find or doesn't belong to user" })
        }
        const { x, y, width } = request
        let point = await mayBePoint.update({
            x,
            y,
            width
        } as MapPoint)
        return res.send(point)
    
    } catch(err) {
        next(err)
    }
})

app.delete('/:mapId/points/:pointId', [auth.verifyToken], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {mapId, pointId} = req.params
        const [request, mayBePoint] = await Promise.all([
            addPoint.validate(req.body),
            MapPoint.findOne({
                where: {
                    id: pointId,
                    mapId 
                }
            })
        ])

        const map = MapToGuess.findOne({
            where: { 
                id: mayBePoint?.mapId,
                userId: req.user?.id
            }
        })
        if(!mayBePoint || !map) {
            return res.status(400).send({ message: "Point not find or doesn't belong to user" })
        }
        const { x, y, width } = request
        let point = await MapPoint.destroy({
            where: { id: pointId}
        })
        return res.status(202).send('ok')
    
    } catch(err) {
        next(err)
    }
})
app.get('/plays', async (req: Request, res: Response) => {
    let maps = await MapToGuess.findAll()
    return res.send(maps)
})


app.get('/:mapId/play', [auth.verifyToken], async (req: Request, res: Response, next: NextFunction) => {
    try {
        let mapId: number = +req.params.mapId
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
            return res.status(400).send({error: 'The map with id ' + mapId + ' doesn\'t exist'})
        }
        const pointsId = points.map(point => {
            return point.dataValues.id
        })
        console.log('pointsId', pointsId)
        const nbPoints = pointsId.length
        const answers = await MapAnswer.findAll({
            where: { 
                mapPointId: { [Op.or]: pointsId },
                userId: req.user?.id
            },
            include: [MapPoint]
        })
        let result = points.map(point => {
            const pointAnsweredIndex = answers.findIndex(p => p.mapPointId === point.id)
            if(pointAnsweredIndex !== -1) return {...answers[pointAnsweredIndex].mapPoint.dataValues, find: true}
            else return {...point.dataValues, find: false}
        })
        const {title, description, fileName} = map?.dataValues
        return res.send({
            title,
            description,
            fileName, 
            nbPoints,
            points: result
        })
    
    } catch(err) {
        next(err)
    }
})
app.post('/:mapId/play/:pointId', [auth.verifyToken], async (req: Request, res: Response, next: NextFunction) => {
    try {
        let mapId: number = +req.params.mapId
        let pointId: number = +req.params.pointId
        const [request, point] = await Promise.all([
            addAnswer.validate(req.body),
            MapPoint.findOne({
                where: { id: pointId }
            })
        ])
        if(!point) {
            return res.status(400).send({error: 'point not find'})
        }
        const {answer} = request
        
        const isAnswerOK = answer.match(point?.possibleAnswers) 

        if(!isAnswerOK) {
            return res.send({
                correct: false
            })
        } else {
            const userId = req.user?.id
            const answerExist = await MapAnswer.findOne({
                where: { userId, mapPointId: pointId}
            })
            if(!answerExist) {
                MapAnswer.create({
                    mapPointId: pointId,
                    userId
                } as MapAnswer)
            }
            return res.send({ correct: true, label: point.label })
        }
    
    } catch(err) {
        next(err)
    }
})
module.exports = app
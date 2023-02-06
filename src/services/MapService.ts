import { CreateMapInputDTO, CreateMapOutputDTO } from "../dto/CreateMap"
import { MapPoint } from "../models/MapPoint";
import { MapToGuess } from "../models/MapToGuess";
import { User } from "../models/User"
const config = require('../config');

const uploadMap = async (file: any, request: CreateMapInputDTO, user: User): Promise<CreateMapOutputDTO> => {
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

module.exports = {
    getMapForUser,
    uploadMap
}
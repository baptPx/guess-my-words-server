import {NextFunction, Request, Response} from 'express'
import { CreateMapOutputDTO } from '../dto/CreateMap'
import { MapToGuess } from '../models/MapToGuess'
const express = require('express')
const app = express()
const mapService = require('../services/MapService')
const auth = require('../middlewares/auth')
const logger = require('../utils/logger')

app.post('/', [auth.verifyToken], async (req: Request, res: Response, next: NextFunction) => {
    logger.info('POST /maps map creation')    
    try {
        if(!req.files) {
            throw('not files')
        }
        const file = req.files['map']
        if(!file) {
            throw({ error: "The file 'map' is missing"})
        }
        const {user} = res.locals
        const resultCreate: CreateMapOutputDTO = await mapService.uploadMap(file, req.body, user)
        return res.status(201).send(resultCreate)
    } catch(err) {
        next(err)
    }
})
app.get('/edits', [auth.verifyToken], async (req: Request, res: Response, next: NextFunction) => {
    logger.info('GET /maps get maps of user for edition')    

    let map = await MapToGuess.findAll({
        where: { userId: res.locals.user?.id }
    })
    return res.send(map)
})

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
    logger.info('GET /maps get all existing maps')
    let map = await MapToGuess.findAll()
    return res.send(map)
})
app.get('/:mapId/edit', [auth.verifyToken], async (req: Request, res: Response, next: NextFunction) => {
    const {mapId} = req.params
    logger.info(`GET /maps/${mapId}/edit get points of a map for edition`)
    try {
        const {user} = res.locals
        const result = await mapService.getMapForUser(mapId, user)
        return res.send(result)
    } catch(err) {
        next(err)
    }
})

app.post('/:mapId/edit', [auth.verifyToken], async (req: Request, res: Response, next: NextFunction) => {
    
    let mapId: number = +req.params.mapId
    logger.info(`POST /maps/${mapId}/edit add a point on a map`)
    try {
        const point = await mapService.addPointToMap(req.body, mapId, res.locals.user)
        return res.send(point)
    } catch(err) {
        next(err)
    }
})



app.patch('/:mapId/points/:pointId', [auth.verifyToken], async (req: Request, res: Response, next: NextFunction) => {
    const {mapId, pointId} = req.params
    logger.info(`PATCH /maps/${mapId}/points/${pointId} edit a point on a map`)
    try {
        const point = await mapService.editPoint(req.body, pointId, res.locals.user)
        return res.send(point)
    } catch(err) {
        next(err)
    }
})

app.delete('/:mapId/points/:pointId', [auth.verifyToken], async (req: Request, res: Response, next: NextFunction) => {
    const {mapId, pointId} = req.params
    logger.info(`DELETE /maps/${mapId}/points/${pointId} delete a point on a map`)
    try {
        await mapService.deletePoint(pointId, res.locals.user)
        return res.status(202).send('ok')
    } catch(err) {
        next(err)
    }
})
app.get('/plays', async (req: Request, res: Response) => {
    logger.info(`GET /maps/plays get all maps playable`)
    let maps = await MapToGuess.findAll()
    return res.send(maps)
})


app.get('/:mapId/plays', [auth.verifyToken], async (req: Request, res: Response, next: NextFunction) => {
    let mapId: number = +req.params.mapId
    logger.info(`GET /maps/${mapId}/plays get points positions and answer for a map`)
    try {
        const result = await mapService.getPlayDataForMap(mapId, res.locals.user)
        return res.send(result)
        
    } catch(err) {
        next(err)
    }
})
app.post('/:mapId/plays/:pointId', [auth.verifyToken], async (req: Request, res: Response, next: NextFunction) => {
    let pointId: number = +req.params.pointId
    let mapId: number = +req.params.mapId
    logger.info(`POST /maps/${mapId}/plays/${pointId} try an answer for a point`)
    try {
            const result = await mapService.tryAnswerOnMap(req.body, mapId, pointId, res.locals.user)
            return res.send(result)
    
    } catch(err) {
        next(err)
    }
})
module.exports = app
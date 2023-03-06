import {NextFunction, Request, Response} from 'express'
import { CreateMapOutputDTO } from '../dto/CreateMap'
import { MapToGuess } from '../models/MapToGuess'
import logger from '../utils/logger';

const express = require('express')
const app = express()
const mapService = require('../services/MapService')
const auth = require('../middlewares/auth')

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
    logger.info('GET /plays get all existing maps')
    let map = await MapToGuess.findAll()
    return res.send(map)
})


app.get('/:mapId', [auth.verifyToken], async (req: Request, res: Response, next: NextFunction) => {
    let mapId: number = +req.params.mapId
    logger.info(`GET /plays/${mapId}/plays get points positions and answer for a map`)
    try {
        const result = await mapService.getPlayDataForMap(mapId, res.locals.user)
        return res.send(result)
        
    } catch(err) {
        next(err)
    }
})
app.post('/:pointId', [auth.verifyToken], async (req: Request, res: Response, next: NextFunction) => {
    let pointId: number = +req.params.pointId
    logger.info(`POST /plays/${pointId} try an answer for a point`)
    try {
            const result = await mapService.tryAnswerOnMap(req.body, pointId, res.locals.user)
            return res.send(result)
    
    } catch(err) {
        next(err)
    }
})
module.exports = app
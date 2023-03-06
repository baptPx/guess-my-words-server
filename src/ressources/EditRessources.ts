import {NextFunction, Request, Response} from 'express'
import { CreateMapOutputDTO } from '../dto/CreateMap'
import { MapToGuess } from '../models/MapToGuess'
import logger from '../utils/logger';
const express = require('express')
const app = express()
const mapService = require('../services/MapService')
const auth = require('../middlewares/auth')

app.post('/', [auth.verifyToken], async (req: Request, res: Response, next: NextFunction) => {
    logger.info('POST /edits map creation', req.body)    
    const {user} = res.locals
    if(user === undefined) {
        return res.status(401).json({
            error: {
                msg: 'Failed to authenticate token!'
            }
        });
    }
    try {
        if(!req.files) {
            throw('not files')
        }
        const file = req.files['map']
        if(!file) {
            throw({ error: "The file 'map' is missing"})
        }
        const resultCreate: CreateMapOutputDTO = await mapService.uploadMap(req.body, file, user)
        return res.status(201).send(resultCreate)
    } catch(err) {
        next(err)
    }
})
app.get('/', [auth.verifyToken], async (req: Request, res: Response, next: NextFunction) => {
    logger.info('GET /edits get maps of user for edition')    
    const {user} = res.locals
    if(user === undefined) {
        return res.status(401).json({
            error: {
                msg: 'Failed to authenticate token!'
            }
        });
    }
    let map = await MapToGuess.findAll({
        where: { userId: user.id }
    })
    return res.send(map)
})

app.get('/:mapId', [auth.verifyToken], async (req: Request, res: Response, next: NextFunction) => {
    const {mapId} = req.params
    const {user} = res.locals
    if(user === undefined) {
        return res.status(401).json({
            error: {
                msg: 'Failed to authenticate token!'
            }
        });
    }
    logger.info(`GET /edits/${mapId} get points of a map for edition`)
    try {
        const result = await mapService.getMapForUser(mapId, user)
        return res.send(result)
    } catch(err) {
        next(err)
    }
})

app.post('/:mapId', [auth.verifyToken], async (req: Request, res: Response, next: NextFunction) => {
    const {user} = res.locals
    if(user === undefined) {
        return res.status(401).json({
            error: {
                msg: 'Failed to authenticate token!'
            }
        });
    }
    let mapId: number = +req.params.mapId
    logger.info(`POST /edits/${mapId} add a point on a map`)
    try {
        const point = await mapService.addPointToMap(req.body, mapId, user)
        return res.send(point)
    } catch(err) {
        next(err)
    }
})



app.patch('/points/:pointId', [auth.verifyToken], async (req: Request, res: Response, next: NextFunction) => {
    const {pointId} = req.params
    logger.info(`PATCH /edits/points/${pointId} edit a point on a map`)
    const {user} = res.locals
    if(user === undefined) {
        return res.status(401).json({
            error: {
                msg: 'Failed to authenticate token!'
            }
        });
    }
    try {
        const point = await mapService.editPoint(req.body, pointId, user)
        return res.send(point)
    } catch(err) {
        next(err)
    }
})

app.delete('/points/:pointId', [auth.verifyToken], async (req: Request, res: Response, next: NextFunction) => {
    const {pointId} = req.params
    logger.info(`DELETE /edits/points/${pointId} delete a point on a map`)
    const {user} = res.locals
    if(user === undefined) {
        return res.status(401).json({
            error: {
                msg: 'Failed to authenticate token!'
            }
        });
    }
    try {
        await mapService.deletePoint(pointId, res.locals.user)
        return res.status(202).send('ok')
    } catch(err) {
        next(err)
    }
})

module.exports = app
import {NextFunction, Request, Response} from 'express'
import {CreateUserDTO, CreateUserOutputDTO, createUserValidator} from "../dto/CreateUser";
import {User} from "../models/User";
import {LoginUserInputDTO, loginUserValidator} from "../dto/LoginUser";
import logger from '../utils/logger';
const express = require('express')
const app = express()
const auth = require('../middlewares/auth')
const userService = require('../services/UserService')


app.post('', async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`POST /users creation of a user`)
    try {
        const userResult: CreateUserOutputDTO = await userService.create(req.body)
        return res.send(userResult)
    } catch(err: any) {
        return next(err)
    }
})

app.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`POST /users/login login of a user`)
    try {
        const loginResponse = await userService.login(req.body)
        return res.send(loginResponse)
    } catch(err: any) {
        next(err)
    }
})

app.get('/account', [auth.verifyToken], async (req: Request, res: Response) => {
    logger.info(`POST /users/account retrieve data for a logged user`)
    const { user } = res.locals
    return res.send(user)
})

module.exports = app
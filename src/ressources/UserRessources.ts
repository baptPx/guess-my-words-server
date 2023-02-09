import {NextFunction, Request, Response} from 'express'
import {CreateUserDTO, CreateUserOutputDTO, createUserValidator} from "../dto/CreateUser";
import {User} from "../models/User";
import {LoginUserInputDTO, loginUserValidator} from "../dto/LoginUser";
const express = require('express')
const app = express()
const auth = require('../middlewares/auth')
const userService = require('../services/UserService')


app.post('', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userRequest: CreateUserDTO = await createUserValidator.validate(req.body)
        const userResult: CreateUserOutputDTO = await userService.create(userRequest)
        return res.send(userResult)
    } catch(err: any) {
        return next(err)
    }
})

app.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginRequest: LoginUserInputDTO = await loginUserValidator.validate(req.body)
        const loginResponse = await userService.login(loginRequest)
        return res.send(loginResponse)
    } catch(err: any) {
        next(err)
    }
})

app.get('/account', [auth.verifyToken], async (req: Request, res: Response) => {
    const { user } = res.locals
    return res.send(user)
})


app.get('', (req: Request, res: any) => {
    res.send({ok: true})
})

module.exports = app
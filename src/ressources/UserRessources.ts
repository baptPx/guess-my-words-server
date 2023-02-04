import {NextFunction, Request, Response} from 'express'
const express = require('express')
const app = express()
import {CreateUserDTO, createUserValidator} from "../dto/CreateUser";
import {User} from "../models/User";
import {LoginUserInputDTO, loginUserValidator} from "../dto/LoginUser";
const bcrypt = require('bcrypt');
const saltRounds = 10;
const auth = require('../middlewares/auth')
const userService = require('../services/UserService')

app.post('', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let userRequest: CreateUserDTO = await createUserValidator.validate(req.body)

        let password = await bcrypt.hash(userRequest.password, saltRounds)
        
        let settedUser = {
            username: userRequest.username,
            password: password,
            id: 123
        } as User
        let userCreated = await User.create(
            settedUser
        )
        return res.send({result: userCreated})
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
        res.send({error: err.message})
    }
})

app.get('/account', [auth.verifyToken], async (req: Request, res: Response) => {
    let user = req.user
    return res.send(req.user)
})


app.get('', (req: Request, res: any) => {
    res.send({ok: true})
})

module.exports = app
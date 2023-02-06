import {NextFunction, Request, Response} from 'express'
import {CreateUserDTO, createUserValidator} from "../dto/CreateUser";
import {User} from "../models/User";
import {LoginUserInputDTO, loginUserValidator} from "../dto/LoginUser";
const express = require('express')
const app = express()
const bcrypt = require('bcrypt');
const saltRounds = 10;
const auth = require('../middlewares/auth')
const userService = require('../services/UserService')
const jwt = require('jsonwebtoken');
const config = require('../config');

app.post('', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let userRequest: CreateUserDTO = await createUserValidator.validate(req.body)

        let password = await bcrypt.hash(userRequest.password, saltRounds)
        
        let settedUser = {
            username: userRequest.username,
            password: password
        } as User
        let userCreated = await User.create(
            settedUser
        )
        const { id, username } = userCreated
        const token = jwt.sign({
            id: id,
            username: username,
        }, config.JWT_SECRET, { expiresIn: 60*60*1000000 })
        return res.send({
             token,
             username
            })
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
    let user = req.user
    return res.send(req.user)
})


app.get('', (req: Request, res: any) => {
    res.send({ok: true})
})

module.exports = app
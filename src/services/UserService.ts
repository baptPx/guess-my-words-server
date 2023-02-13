import { CreateUserDTO, CreateUserOutputDTO, createUserValidator } from "../dto/CreateUser";
import {LoginUserInputDTO, LoginUserOutputDTO, loginUserValidator} from "../dto/LoginUser";
import {User} from "../models/User";

const jwt = require('jsonwebtoken');
const config = require('../config');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const login = async (body: any): Promise<LoginUserOutputDTO> => {
    const loginRequest: LoginUserInputDTO = await loginUserValidator.validate(body)

    const user = await User.findOne({
        where: { username: loginRequest.username }
    })
    const { username, password } = loginRequest
    if(!user) {
        throw({ message: 'User not find or wrong password' })
    }
    const { id } = user
    let isVerified = await bcrypt.compare(password, user.password)
    if(!isVerified) {
        throw({ message: 'User not find or wrong password' })
    }
    const token = jwt.sign({
        id: id,
        username,
    }, config.JWT_SECRET, { expiresIn: 60*60*1000000 })
    return { token, username, id };
}

const create = async (body: any): Promise<CreateUserOutputDTO> => {
    
    const userRequest: CreateUserDTO = await createUserValidator.validate(body)
    
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
    return { token, username, id }
}
module.exports = {
    login,
    create
}
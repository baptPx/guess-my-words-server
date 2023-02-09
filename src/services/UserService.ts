import { CreateUserDTO, CreateUserOutputDTO } from "../dto/CreateUser";
import {LoginUserInputDTO, LoginUserOutputDTO} from "../dto/LoginUser";
import {User} from "../models/User";

const jwt = require('jsonwebtoken');
const config = require('../config');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const login = async (request: LoginUserInputDTO): Promise<LoginUserOutputDTO> => {
    const user = await User.findOne({
        where: { username: request.username }
    })
    const { username, password } = request
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

const create = async (request: CreateUserDTO): Promise<CreateUserOutputDTO> => {
    let password = await bcrypt.hash(request.password, saltRounds)
        
    let settedUser = {
        username: request.username,
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
import {LoginUserInputDTO, LoginUserOutputDTO} from "../dto/LoginUser";
import {User} from "../models/User";

const jwt = require('jsonwebtoken');
const config = require('../config');
const bcrypt = require('bcrypt');

const login = async (request: LoginUserInputDTO): Promise<LoginUserOutputDTO> => {
    const user = await User.findOne({
        where: { username: request.username }
    })
    const { username, password } = request
    if(!user) {
        throw({ message: 'User not find or wrong password' })
    }
    let isVerified = await bcrypt.compare(password, user.password)
    if(!isVerified) {
        throw({ message: 'User not find or wrong password' })
    }
    const token = jwt.sign({
        id: user.id,
        username,
    }, config.JWT_SECRET, { expiresIn: 60*60 })
    return { token, username };
}
module.exports = {
    login
}
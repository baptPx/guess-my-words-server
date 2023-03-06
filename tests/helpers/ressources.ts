import { MapToGuess } from "../../src/models/MapToGuess";
import { User } from "../../src/models/User"
const fs = require('fs');


const userService = require('../../src/services/UserService')
const mapService = require('../../src/services/MapService')

const createUser = async () => {
    return await userService.create({username: 'user1', password: '123'})
}
const createMap = async (user: User) => {
    
    return await MapToGuess.create({
        title: 'title',
        description: 'description',
        fileName: 'filename',
        userId: user.id
    } as MapToGuess)
}
const createPoint = async(possibleAnswers: string, user: User, map?: MapToGuess) => {
    if(map === undefined) {
        map = await createMap(user)
    }
    return await mapService.addPointToMap({x: 50, y: 50, width: 50, label: 'answer 1', possibleAnswers}, map.id, user)
}
module.exports = {createUser, createMap, createPoint}
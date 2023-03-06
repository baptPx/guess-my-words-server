import supertest from 'supertest';
import {beforeEach, describe, expect, test} from '@jest/globals';
const {app, start} = require('../../src/App')
const {createUser, createMap} = require('../helpers/ressources')
describe('EditRessources tests', () => {
    beforeEach(async() => {
        await start()
    })
    test('upload file', async() => {
        const {token} = await createUser()
        return supertest(app)
            .post('/api/edits')
            .set('Authorization', 'Bearer ' + token)
            .field('title', 'title')
            .field('description', 'description')
            .attach('map', __dirname + '/../files/mapjv.jpg')
            .expect(201)
    })
    test('add point to map', async() => {
        const user = await createUser()
        const map = await createMap(user)
        return supertest(app)
            .post('/api/edits/' + map.id)
            .set('Authorization', 'Bearer ' + user.token)
            .send({x: 50, y: 50, width: 50, label: 'answer 1', possibleAnswers: 'answer1'})
            .expect(200)
    })
})

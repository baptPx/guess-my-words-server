import supertest from 'supertest';
import {beforeEach, describe, expect, test} from '@jest/globals';
const {app, start} = require('../../src/App')
const {createUser, createPoint, createMap} = require('../helpers/ressources')
describe('EditRessources tests', () => {
    beforeEach(async() => {
        await start()
    })
    test('play point', async() => {
        const user = await createUser()
        const map = await createMap(user)
        const point = await createPoint('answer', map, user)
        return supertest(app)
            .post('/api/plays/' + point.id)
            .set('Authorization', 'Bearer ' + user.token)
            .send({answer: 'answer'})
            .expect(200)
            .expect(res => expect(res.body.correct).toBeTruthy())
    })
    test('play point not log', async() => {
        const user = await createUser()
        const map = await createMap(user)
        const point = await createPoint('answer', map, user)
        return supertest(app)
            .post('/api/plays/' + point.id)
            .send({answer: 'answer'})
            .expect(200)
            .expect(res => expect(res.body.correct).toBeTruthy())
    })
})

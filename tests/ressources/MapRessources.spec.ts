import supertest from 'supertest';
import {describe, expect, test} from '@jest/globals';
let app = require('../../src/App')
console.log('dirname', __dirname)
describe('MapRessources tests', () => {
    test('upload file', () => {
        return supertest(app)
            .post('/api/maps')
            .field('title', 'title')
            .field('description', 'description')
            .attach('map', __dirname + '/../files/mapjv.jpg')
            .expect(201)

    })
})

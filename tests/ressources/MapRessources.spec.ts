import supertest from 'supertest';
import {app} from '../../src/App'
import {describe, expect, test} from '@jest/globals';

describe('MapRessources tests', () => {
    test('upload file', () => {
        return supertest(app)
            .get('/api/maps')
            // .attach('myfile', 'file/path/name.txt');

    })
})

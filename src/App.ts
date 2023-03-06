import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import logger from './utils/logger';
const {sequelize, createDBIfNotExist} = require('./database')
const bodyParser = require('body-parser')
const session = require('express-session')
const users = require('./ressources/UserRessources')
const editRessources = require('./ressources/EditRessources')
const playRessources = require('./ressources/PlayRessources')
const {errorHandler} = require('./middlewares/errorHandler')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const app: Express = express();
const {FORCE_SYNC} = require('./config')
console.log('force sync', FORCE_SYNC)
async function start() {
    await sequelize.sync({ logging: false }); 

    dotenv.config(); 

    app.use(cors());

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    app.use(express.static('public'))
    app.use('/images', express.static('maps'))

    app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

    app.use(fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
    }));

    app.get('/', (req: Request, res: Response) => {
        res.send('Express + TypeScript Server');
    });
    app.use('/api/edits', editRessources)
    app.use('/api/plays', playRessources)
    app.use('/api/users', users)

    app.use(errorHandler)

}
module.exports = {app, start}
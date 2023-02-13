import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import logger from './utils/logger';
const sequelize = require('./database')
const bodyParser = require('body-parser')
const session = require('express-session')
const users = require('./ressources/UserRessources')
const maps = require('./ressources/MapRessources')
const {errorHandler} = require('./middlewares/errorHandler')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const app: Express = express();
async function start() {
    sequelize.sync({ logging: false });

    // let inserted = await User.create({username: 'bapt', password: '123'})
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
        logger.info('test')
        res.send('Express + TypeScript Server');
    });
    app.use('/api/maps', maps)
    app.use('/api/users', users)

    app.use(errorHandler)

}
start()
module.exports = app
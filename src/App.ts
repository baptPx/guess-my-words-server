import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
const sequelize = require('./database')
const bodyParser = require('body-parser')
const session = require('express-session')
const users = require('./ressources/UserRessources')
const maps = require('./ressources/MapRessources')
const auth = require('./middlewares/auth')
const {errorHandler} = require('./middlewares/errorHandler')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const app: Express = express();
async function start() {
    sequelize.sync({force: true});

    // let inserted = await User.create({username: 'bapt', password: '123'})
    dotenv.config();

    app.use(cors());

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

    app.use(fileUpload());

    const port = 3001;
    app.get('/', (req: Request, res: Response) => {
        res.send('Express + TypeScript Server');
    });
    console.log('app before maps')
    app.use('/api/maps', maps)
    app.use('/api/users', users)

    console.log('maps', maps)
    app.use(errorHandler)
    app.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
}
start()
export {app}
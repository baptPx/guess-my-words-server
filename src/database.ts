const { Sequelize } = require('sequelize-typescript');
const { Client } = require('pg')
const config = require('./config')

const sequelize = new Sequelize(config.DATABASE_NAME, config.DATABASE_USERNAME, config.DATABASE_PASSWORD, {
    host: config.DATABASE_URL,
    logging: false,
    dialect: 'postgres',
    models: [__dirname + '/models']
});

const createDBIfNotExist = async() => {
    const client = new Client()
    await client.connect({ 
        host: config.DATABASE_URL,
        port: config.DATABASE_PORT,
        user: config.DATABASE_USERNAME, 
        password: config.DATABASE_PASSWORD
    })
    await client.query(`CREATE DATABASE IF NOT EXISTS \`${config.DATABASE_NAME}\`;`);
    await client.end()

}
module.exports = {sequelize, createDBIfNotExist}
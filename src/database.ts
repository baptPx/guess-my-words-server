const { Sequelize } = require('sequelize-typescript');

const config = require('./config')
const sequelize = new Sequelize(config.DATABASE_NAME, config.DATABASE_USERNAME, config.DATABASE_PASSWORD, {
    host: config.DATABASE_URL,
    dialect: 'postgres',
    models: [__dirname + '/models']
});
module.exports = sequelize
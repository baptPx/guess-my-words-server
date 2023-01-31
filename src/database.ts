const { Sequelize } = require('sequelize-typescript');


const sequelize = new Sequelize('guessmywords', 'admin', 'admin', {
    host: 'localhost',
    dialect: 'postgres',
    models: [__dirname + '/models']
});
module.exports = sequelize
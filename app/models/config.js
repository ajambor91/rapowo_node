const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user:'root',
        password: 'M4A1Carbine@',
        database: 'rapowo',
        charset: 'utf8'
    }
});
module.exports = knex;

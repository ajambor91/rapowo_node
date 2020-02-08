const knex = require('./config');
const bookshelf = require('bookshelf')(knex);
const Error = bookshelf.model('Error',{
    tableName: 'error'
});
module.exports = Error;

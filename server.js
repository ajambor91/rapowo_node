const express = require('express'),
    routes = require('./app/routes');

const app = express()
app.use(routes);
const server = app.listen( 3000, () => {
    console.log(`Listening on ${server.address().port}`);

});

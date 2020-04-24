require('dotenv').config();
let socketCollection = require('./app/helpers/socket-collection');
const express = require('express');
const routes = require('./app/routes');
const app = express();
const webSocket = require('ws');


app.use(routes);
const server = app.listen( 3000, () => {
    console.log(`Listening`);

});
const wsServer = new webSocket.Server({server});
wsServer.on('connection', ws => {
    ws.send("{\"status\":true}");
    ws.on('message', (msg)=> {
        const JSONMsg = JSON.parse(msg);
        socketCollection.wsCollection.collection.push({userId: JSONMsg.userId, ws: ws});
        ws.send('dupa')
    })

});



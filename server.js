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
    ws.send(JSON.stringify({status: true, data: 'init'}));
    ws.on('message', (msg)=> {
        const JSONMsg = JSON.parse(msg);
        const collLength = socketCollection.wsCollection.collection.length;
        for (let i = 0; i< collLength; i++){
            if(socketCollection.wsCollection.collection[i].userId === JSONMsg.userId){
                socketCollection.wsCollection.collection.splice(i,1);
            }
            socketCollection.wsCollection.collection.push({userId: JSONMsg.userId, ws: ws});
        }
        if(collLength === 0){
            socketCollection.wsCollection.collection.push({userId: JSONMsg.userId, ws: ws});
        }
    })

});



const constants = require('./../helpers/constants');
const db = require('../models/config');
const bookshelf = require('bookshelf')(db);
const http =  require('request');
const EventModel = require('./../models/event');
const errorModel = require('./../models/error');
const Error = new errorModel();
const MAILING_URL = 'http://rapowo-backend-local.com/mailing';
const wsCollection = require('./../helpers/socket-collection');
module.exports = {
    newTexts(req, res){
        const eventId = req.params.id;
        res.sendStatus(200);
        const Event = new EventModel();
        Event.prepareNewTextEvent(eventId).then(result=>{
            const resultLength = result.length;
            const wsCollLength = wsCollection.wsCollection.collection.length;
            console.log(wsCollection.wsCollection.collection,'collectionm')
            for(let i = 0; i < wsCollLength; i++){
                for (let j = 0; j < resultLength; j++){
                    if(wsCollection.wsCollection.collection[i].userId === result[j].receiver){
                        let wsClient = wsCollection.wsCollection.collection[i].ws;
                        wsClient.send(JSON.stringify({status: 'incomming',data:result[j]}))
                    }
                }
            }
            //TODO zastanowić się nad przeniesiem do osobnej funkcji
            http.post({
                url: `${MAILING_URL}/new-text`,
                json: result
        }, (error, res, body)=>{
                if(error){
                    Error.save({
                        date: new Date(),
                        comment: error,
                        type: constants.NEW_TEXT_TYPE,
                        event_id: eventId
                    });
                }

            })
        });
        }
};

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
            console.log('dupa')
            this.sendWs(result, constants.WS_MSG.NEW_FOLLOWED_TEXT);
            this.sendToSymfony('new-text',result, eventId, constants.WS_MSG.NEW_FOLLOWED_TEXT);
        });
        },
    mostComment(req,res){
        const eventId = req.params.id;
        const Event = new EventModel();
        res.sendStatus(200);
        Event.getGenericEvent(eventId).then( res => {
            this.sendWsToAllLoggedUser(res[0], constants.WS_MSG.MOST_COMMENT);
        });
    },
    newGeneralText(req, res){
        const eventId = req.params.id;
        const Event = new EventModel();
        res.sendStatus(200);
        Event.getGenericEvent(eventId).then( res => {
            this.sendWsToAllLoggedUser(res[0], constants.WS_MSG.NEW_TEXT);
        });
    },
    popularTexts(req, res){
        const eventId = req.params.id;
        const Event = new EventModel();
        res.sendStatus(200);
        Event.getGenericEvent(eventId).then( res => {
            this.sendWsToAllLoggedUser(res[0], constants.WS_MSG.POPULAR);
        });
    },
    popularFollowed(req,res){
        const eventId = req.params.id;
        const Event = new EventModel();
        res.sendStatus(200);
        Event.getPopularFollowedText(eventId).then(res => {
            this.sendPopularWS(res, constants.WS_MSG.POPULAR_FOLLOWED);
        });
    },
    sendWs(result, message){
        let resultLength = result.length;
        const wsCollLength = wsCollection.wsCollection.collection.length;
        let resArr = result;
        for(let i = 0; i<result.length; i++){
            for (let j = 0; j<resArr.length; j++){
                if(typeof resArr[j] !== 'undefined' && typeof result[i] !== 'undefined' && resArr[j].receiver ===  result[i].receiver){
                    result.splice(i, 1);
                    console.log(result,'res');
                }
            }
        }
        resultLength = result.length;
        for(let i = 0; i < wsCollLength; i++){
            for (let j = 0; j < resultLength; j++){
                if(wsCollection.wsCollection.collection[i].userId === result[j].receiver){
                    let wsClient = wsCollection.wsCollection.collection[i].ws;
                    wsClient.send(JSON.stringify({status: message,data:result[j]}))
                    if(typeof result[i] !== 'undefined' && result[i].type){
                        result.splice(i, 1);
                    }
                }
            }
        }
    },
    sendPopularWS(result, message){
        const wsColLength = wsCollection.wsCollection.collection.length;
        const resLength = result.length;
        for(let i = 0; i<wsColLength; i++){
            for(let j = 0; j< resLength; j++){
                if(wsCollection.wsCollection.collection[i].userId === result[j].receiver){
                    let ws = wsCollection.wsCollection.collection[i].ws;
                    ws.send(JSON.stringify({status: message, data: result[j]}))
                }
            }
        }
    },
    sendWsToAllLoggedUser(result, message){
        const wsColletcionLength = wsCollection.wsCollection.collection.length;
        for(let i = 0; i< wsColletcionLength; i++){
            let ws = wsCollection.wsCollection.collection[i].ws;
            ws.send(JSON.stringify({status: message, data: result}))
        }
    },
    sendToSymfony(path, result, eventId, type){
        const resLength = result.length;
        let resArr = [];
        for (let i = 0; i<resLength; i++){
            if(result[i].type === type){
                resArr.push(result[i]);
            }
        }
        http.post({
            url: `${MAILING_URL}/${path}`,
            json: resArr
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
    }
};

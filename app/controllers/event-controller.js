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
            console.log(result,'du[pa')
            this.sendWs(result, constants.WS_MSG.NEW_FOLLOWED_TEXT);
            this.sendToSymfony('new-text',result, eventId, constants.SETTINGS.NEW_TEXT_TYPE);
        });
        },
    mostComment(req,res){
        const eventId = req.params.id;
        const Event = new EventModel();
        res.sendStatus(200);
        Event.getGenericEvent(eventId).then( res => {
            console.log(res);
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
            console.log(res);
            this.sendWsToAllLoggedUser(res[0], constants.WS_MSG.POPULAR);
        });
    },
    popularFollowed(req,res){
        const eventId = req.params.id;
        const Event = new EventModel();
        res.sendStatus(200);
        Event.getPopularFollowedText(eventId).then(res => {
            console.log(res)
            this.sendPopularWS(res, constants.WS_MSG.POPULAR_FOLLOWED);
        });
    },
    newComment(req,res){
        const eventId = req.params.id;
        const Event = new EventModel();
        res.sendStatus(200);
        Event.getNewComment(eventId).then(res => {
            this.singleWsSend(res, constants.WS_MSG.NEW_COMMENT);
            this.sendToSymfony('new-comment',res,eventId,constants.SETTINGS.NEW_COMMENT);
        });
    },
    getReplyComment(req, res){
        const eventId = req.params.id;
        const Event = new EventModel();
        res.sendStatus(200);
        Event.getReplyComments(eventId).then(res => {
            this.singleWsSend(res, constants.WS_MSG.REPLY_COMMENT);
            this.sendToSymfony('reply-comment', res,eventId, constants.SETTINGS.REPLY_COMMENT);
        });
    },
    sendWs(result, message){

        let resultLength = result.length;
        const wsCollLength = wsCollection.wsCollection.collection.length;
        result = this.getUniqueArray(result);
        resultLength = result.length;
        for(let i = 0; i < wsCollLength; i++){
            for (let j = 0; j < resultLength; j++){
                if(typeof result[j] !== 'undefined' && wsCollection.wsCollection.collection[i].userId === result[j].receiver && wsCollection.wsCollection.collection[i].userId !== result[j].author){
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
                if(wsCollection.wsCollection.collection[i].userId === result[j].receiver && result[j].receiver !== result[j].author){
                    let ws = wsCollection.wsCollection.collection[i].ws;
                    ws.send(JSON.stringify({status: message, data: result[j]}))
                }
            }
        }
    },
    singleWsSend(result, message){
      const wsCollLength = wsCollection.wsCollection.collection.length;
      for(let i = 0; i< wsCollLength; i++){
          if(wsCollection.wsCollection.collection[i].userId === result[0].receiver && wsCollection.wsCollection.collection[i].userId !== result[0].author){
              let ws = wsCollection.wsCollection.collection[i].ws;
              ws.send(JSON.stringify({status: message, data: result[0]}));
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
    getUniqueArray(arr){
        return arr.map(item => item.receiver)
            .map((item, i, final) => final.indexOf(item) === i && i)
            .filter(item => arr[item])
            .map(item => arr[item]);
    },
    sendToSymfony(path, result, eventId, type){
        console.log(result)

        const resLength = result.length;
        let resArr = [];
        for (let i = 0; i<resLength; i++){
            if((type !== constants.SETTINGS.REPLY_COMMENT || type !== constants.SETTINGS.NEW_COMMENT ) &&
                result[i].receiver === result[i].author){
                console.log('in')
                continue;
            }
            if(result[i].type === type){
                resArr.push(result[i]);
            }
        }

        resArr = this.getUniqueArray(resArr);
        console.log(resArr)
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

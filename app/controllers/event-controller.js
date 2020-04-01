const constants = require('./../helpers/constants');
const db = require('../models/config');
const bookshelf = require('bookshelf')(db);
const http =  require('request');
const EventModel = require('./../models/event');
const errorModel = require('./../models/error');
const Error = new errorModel();
const MAILING_URL = 'http://rapowo-backend-local.com/mailing';

module.exports = {
    newTexts(req, res){
        const eventId = req.params.id;
        res.sendStatus(200);
        const Event = new EventModel();
        console.log(eventId)
        Event.prepareNewTextEvent(eventId).then(result=>{
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

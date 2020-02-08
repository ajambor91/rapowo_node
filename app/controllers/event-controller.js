const db = require('../models/config');
const bookshelf = require('bookshelf')(db);
const http =  require('request');
const EventModel = require('./../models/event');
const MAILING_URL = 'http://rapowo-backend.local/mailing'
module.exports = {
    newTexts(req, res){
        const eventId = req.params.id;
        res.sendStatus(200);
        const Event = new EventModel();
        Event.prepareNewTextEvent(eventId).then(result=>{
            http.post({
                url: `${MAILING_URL}/new-text`,
                form: result
        }, (error, res, body)=>{
                console.log('ok');
            })
        });
        }
};

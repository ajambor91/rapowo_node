const knex = require('./config');
const bookshelf = require('bookshelf')(knex);
const constants = require('./../helpers/constants');

const EventModel = bookshelf.model('Event',{
        tableName: 'event',
        prepareNewTextEvent(eventId){
            return knex
                .distinct('user.id')
                .from('event')
                .select(['event.id as event_id','event.text_id as text', 'text.title', 'author.id as author','author.nick as author_nick', 'user.id as receiver','user.nick as receiver_nick','user.email as email','setting.type'])
                .innerJoin('text','text.id','event.text_id')
                .innerJoin('user as author','text.user_id','author.id')
                .innerJoin('observator','event.user_id','observator.user_id')
                .innerJoin('user','observator.observator_id','user.id')
                .innerJoin('setting','user.id','setting.user_id')
                .where({'event.id': eventId, 'setting.type': constants.NEW_TEXT_TYPE});

        }
    }
);
module.exports = EventModel;

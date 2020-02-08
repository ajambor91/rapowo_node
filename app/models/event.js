const knex = require('./config');
const bookshelf = require('bookshelf')(knex);

const NEW_TEXT_TYPE = 1;

const EventModel = bookshelf.model('Event',{
        tableName: 'event',
        prepareNewTextEvent(eventId){
            return knex
                .from('event')
                .select(['event.text_id as text', 'text.title', 'author.id as author','author.nick as author_nick', 'user.id as receiver','user.nick as receiver_nick','setting.type'])
                .innerJoin('observator','event.user_id','observator.user_id')
                .innerJoin('user','observator.observator_id','user.id')
                .innerJoin('setting','user.id','setting.user_id')
                .innerJoin('text','text.user_id','event.user_id')
                .innerJoin('user as author','text.user_id','author.id')
                .where({'event.id': eventId, 'setting.type':NEW_TEXT_TYPE});

        }
    }
);
module.exports = EventModel;

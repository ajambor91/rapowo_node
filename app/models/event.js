const knex = require('./config');
const bookshelf = require('bookshelf')(knex);
const constants = require('./../helpers/constants');

const EventModel = bookshelf.model('Event',{
        tableName: 'event',
        prepareNewTextEvent(eventId){
            return knex
                .distinct(['user.id'])
                .from('event')
                .select(['image.path','event.id as event_id','event.text_id as text', 'text.title','text.slug' ,'author.id as author','author.nick as author_nick', 'user.id as receiver','user.nick as receiver_nick','user.email as email','event.type as event_type','setting.type as type'])
                .innerJoin('text','text.id','event.text_id')
                .innerJoin('user as author','text.user_id','author.id')
                .innerJoin('observator','event.user_id','observator.user_id')
                .innerJoin('user','observator.observator_id','user.id')
                .innerJoin('setting','user.id','setting.user_id')
                .leftJoin('image','image.user_id','author.id')
                .where({'event.id': eventId})
                .andWhere(function () {
                    this.where({'image.type': constants.IMAGE_TYPES.NAVBAR_THUMB}).orWhere({'image.path':null})
                })
        },
        getGenericEvent(eventId) {
            return knex
                .distinct('event.id')
                .from('event')
                .select(['event.id as event_id', 'event.text_id as text_id', 'text.title', 'text.slug', 'user.id as author', 'user.nick as author', 'event.type as event_type'])
                .innerJoin('text', 'text.id', 'event.text_id')
                .innerJoin('user', 'user.id', 'text.user_id')
                .leftJoin('image', 'image.user_id', 'user.id')
                .where({'event.id': eventId})
                .andWhere(function () {
                    this.where({'image.type': constants.IMAGE_TYPES.NAVBAR_THUMB}).orWhere({'image.path': null})
                });
        },
        getPopularFollowedText(eventId){
            return knex
                .distinct('text.id')
                .select(['event.id as event_id','event.text_id as text', 'text.title','text.slug' ,'author.id as author','author.nick as author_nick', 'user.id as receiver','user.nick as receiver_nick','user.email as email','event.type as event_type'])
                .from('event')
                .innerJoin('text','text.id','event.text_id')
                .innerJoin('user as author','text.user_id','author.id')
                .innerJoin('observator','author.id','text.user_id')
                .innerJoin('user','user.id','observator.observator_id')
                .leftJoin('image','image.user_id','user.id')
                .where({'event.id': eventId})
                .andWhere(function () {
                    this.where({'image.type': constants.IMAGE_TYPES.NAVBAR_THUMB}).orWhere({'image.path':null})
                });
        }
    }
);
module.exports = EventModel;

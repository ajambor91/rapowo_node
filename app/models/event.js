const knex = require('./config');
const bookshelf = require('bookshelf')(knex);
const constants = require('./../helpers/constants');

const EventModel = bookshelf.model('Event',{
        tableName: 'event',
        prepareNewTextEvent(eventId){
            return knex
                .from('event')
                .select(['image.path','event.id as event_id','event.text_id as text', 'text.title','text.slug' ,'author.id as author','author.nick as author_nick', 'user.id as receiver','user.nick as receiver_nick','user.email as email','event.type as event_type','setting.type as type'])
                .innerJoin('text','text.id','event.text_id')
                .innerJoin('user as author','text.user_id','author.id')
                .innerJoin('observator','event.user_id','observator.user_id')
                .innerJoin('user','observator.observator_id','user.id')
                .innerJoin('setting','setting.user_id','author.id')
                .leftJoin('image','image.user_id','author.id')
                .where({'event.id': eventId})
                .andWhere( function () {
                    this.where({'setting.type': null}).orWhere({'setting.type': 1})
                })
                .andWhere( function () {
                    this.where({'image.type': constants.IMAGE_TYPES.NAVBAR_THUMB}).orWhere({'image.path': null})
                });
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
        },
        getNewComment(eventId){
            return knex
                .select(['comment.id as comment_id','event.id as event_id','event.text_id as text', 'text.title','text.slug' ,'author.id as author','author.nick as author_nick', 'user.id as receiver','user.nick as receiver_nick','user.email as email','event.type as event_type','setting.type as type','image.path'])
                .from('event')
                .innerJoin('comment','event.comment_id','comment.id')
                .innerJoin('text','text.id','comment.text_id')
                .innerJoin('user','user.id','text.user_id')
                .innerJoin('user as author','author.id','comment.user_id')
                .leftJoin('setting','setting.user_id','user.id')
                .leftJoin('image','image.user_id','author.id')
                .where({'event.id': eventId})
                .andWhere(function () {
                    this.where({'image.type': constants.IMAGE_TYPES.NAVBAR_THUMB}).orWhere({'image.path':null})
                })
        },
        getReplyComments(eventId){
            return knex
                .select(['parent.id as parent_comment_id','image.path as path','event.id as event_id','text.id as text', 'text.title','text.slug' ,'author.id as author','author.nick as author_nick', 'receiver.id as receiver','receiver.nick as receiver_nick','receiver.email as email','event.type as event_type','setting.type as type'])
                .from('event')
                .innerJoin('comment as child','child.id','event.comment_id')
                .innerJoin('comment as parent', 'child.parent_comment_id','parent.id')
                .innerJoin('text','parent.text_id','text.id')
                .innerJoin('user as author','child.user_id','author.id')
                .innerJoin('user as receiver', 'receiver.id','parent.user_id')
                .leftJoin('setting','setting.user_id','receiver.id')
                .leftJoin('image','image.user_id','author.id')
                .where({'event.id': eventId})
                .andWhere(function () {
                    this.where({'image.type': constants.IMAGE_TYPES.NAVBAR_THUMB}).orWhere({'image.path':null})
                })

        }
    }
);
module.exports = EventModel;

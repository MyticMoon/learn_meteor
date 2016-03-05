/**
 * Created by myticmoon on 5/3/16.
 */
Cards = new Meteor.Collection('cards');

Cards.allow({
    insert: function(userId, doc) {
        return !!userId;
    },
    update: ownsDocument,
    remove: ownsDocument
});
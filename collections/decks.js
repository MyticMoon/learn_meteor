Decks = new Meteor.Collection('decks');

Decks.allow({
    insert: function(userId, doc) {
       return !!userId;
    },
    update: ownsDocument,
    remove: ownsDocument
});
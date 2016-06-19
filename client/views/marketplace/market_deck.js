Template.marketDeck.helpers({
    'isAuthor': function() {
        return Meteor.userId() == this.userId;
    }
});
Template.decksList.helpers({
    decks: function() {
        return Decks.find({userId: Meteor.userId()}, {sort: {submitted: -1}});
    }
});
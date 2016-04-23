Template.decksList.helpers({
    decks: function() {
        var decks = Decks.find({userId: Meteor.userId(), type: "personalDeck"}, {sort: {submitted: -1}});
        return decks;
    },
    purchasedDecks: function() {
        var decks = Decks.find({userId: Meteor.userId(), type: "purchasedDeck"}, {sort: {submitted: -1}});
        return decks;
    }
});
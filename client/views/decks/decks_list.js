Template.decksList.helpers({
    decks: function() {
        var decks = Decks.find({userId: Meteor.userId(), type: {$not: "marketDeck"}}, {sort: {submitted: -1}});

        return decks;
    }
});
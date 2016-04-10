Template.marketMain.helpers({
    'marketDeckList': function() {
        var decks =  Decks.find({type: "marketDeck"});
        return decks;
    }
});
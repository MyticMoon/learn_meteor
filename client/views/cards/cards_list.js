Template.cardsList.helpers({
    getCards: function() {
        var deck = Decks.findOne(Session.get('currentDeckId'));

    }
});
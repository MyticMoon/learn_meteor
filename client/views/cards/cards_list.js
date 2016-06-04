Template.cardsList.helpers({
    'cardsList': function(){
        var currentDeckId = Session.get('currentDeckId');
        return Cards.find({deckId: currentDeckId});
    },
    'currentDeckId': function()
    {
        return {_id: Session.get('currentDeckId')};
    },
    hasMoreCards: function() {
        this.cards.rewind();
        if(!Router.current().cardsLimit()) return false;
        return Router.current().cardsLimit() == this.cards.fetch().length;
    }
});
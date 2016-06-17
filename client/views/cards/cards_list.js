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
    },
    textQuery: function() {
        var currentDeckId = Session.get('currentDeckId');
        return Session.get(currentDeckId + 'textQuery');
    }
});

Template.cardsList.events({
    'keyup [name=search_field]': _.debounce(function(event, template) {
        event.preventDefault();
        var currentDeckId = Session.get('currentDeckId');
        Session.set(currentDeckId + 'textQuery', template.find('[name=search_field]').value);
        }, 500)
});

//TODO: remove this
//Tracker.autorun(function () {
//    var currentDeckId = Session.get('currentDeckId');
//    var creating = Session.get(currentDeckId + 'textQuery');
//    if (creating) {
//        Tracker.afterFlush(function(){
//            $('[name=search_field]').focus();
//        });
//    }
//});
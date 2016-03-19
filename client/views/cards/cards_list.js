Template.cardsList.helpers({
    'cardsList': function(){
        var currentDeckId = Session.get('currentDeckId');
        return Cards.find({deckId: currentDeckId});
    },
    'currentDeckId': function()
    {
        return {_id: Session.get('currentDeckId')};
    }
});
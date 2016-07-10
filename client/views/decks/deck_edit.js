Template.deckEdit.helpers({
    deck: function() {
        return Decks.findOne(Session.get('currentDeckId'));
    }
});

Template.deckEdit.events({
    'submit form': function (e) {
        e.preventDefault();
        var currentDeckId = Session.get('currentDeckId');
        var deck = {
            title: $(e.target).find('[name=title]').val()
        };

        Decks.update(currentDeckId, {$set: deck}, function (error) {
            if (error) {
                throwError(error.reason);
                if (error.error === 302) {
                    //Router.go('postPage', {_id: error.details}, {});
                }
            } else {
                Router.go('cardsList', {_id: currentDeckId});
            }
        });
    },
    'click .delete': function(e) { e.preventDefault();
        if (confirm("Delete this deck?")) {
            var currentDeckId = Session.get('currentDeckId');
            var cards = Cards.find({deckId: currentDeckId});
            if(cards.count() > 0) {
                sAlert.warning("Can't remove deck contains cards");
            }
            else{
                Decks.remove(currentDeckId);
                Router.go('learnPage');
            }
        } }
});
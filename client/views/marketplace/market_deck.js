Template.marketDeck.helpers({
    'isAuthor': function() {
        return Meteor.userId() == this.userId;
    },
    'voteable': function() {
        return Meteor.userId();
    }
});

var rateDeck = function(e, rating, deckId){
    var oldValue = Session.get("DeckRating" + deckId);
    if(oldValue != rating) {
        Meteor.call('submitRating', rating, deckId, function(error, response){
            if(error) {
                console.log(error);
            }
            else{
                console.log("Success");
            }
        });
    }
    Session.set("DeckRating" + deckId, rating);

};

Template.marketDeck.events({
    'click .star-1': function(e) {
        // Get marketDeck from template currentData
        rateDeck(e, 1, Template.currentData()._id);
    },
    'click .star-2': function(e) {
        // Get marketDeck from template currentData
        rateDeck(e, 2, Template.currentData()._id);
    },
    'click .star-3': function(e) {
        // Get marketDeck from template currentData
        rateDeck(e, 3, Template.currentData()._id);
    },
    'click .star-4': function(e) {
        // Get marketDeck from template currentData
        rateDeck(e, 4, Template.currentData()._id);
    },
    'click .star-5': function(e) {
        // Get marketDeck from template currentData
        rateDeck(e, 5, Template.currentData()._id);
    }
});
Template.learnPage.helpers({
    'cardsLearn': function(){
        var decks = Decks.find({userId: Meteor.userId()});
        var listOfDecksId = decks.map(function(element){return element._id;});
        var cards = Cards.find({deckId: {$in: listOfDecksId}});
        return cards;
    }
});
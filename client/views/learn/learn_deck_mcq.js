Template.learnDeckMCQ.helpers({
    'cardsLearnMCQ': function() {
        var currentLearningDeckId = Session.get('currentLearningDeck');
        return getCardsForMCQ("MCQ", currentLearningDeckId);
    }
});

getCardsForMCQ = function(learnDeckType, deckId) {
    var cardToLearns = LearningDeck.find({learnDeckType: learnDeckType, deckId: deckId});
    var cards = [];
    if(cardToLearns.count() == 0) {
        var decks = [];
        if(learnDeckType === "mainLearnPage") {
            decks = Decks.find({userId: Meteor.userId()});
        }
        else {
            decks = Decks.find({userId: Meteor.userId(), _id: deckId});
        }
        var listOfDecksId = decks.map(function(element){return element._id;});
        cards = Cards.find({deckId: {$in: listOfDecksId}});
        if(cards.count() < 5) {
            alert("The deck must have minimum 5 cards.");
            return [];
        }
        cards = randomizeCard(cards, 5);

        //Get the first card as card to learnt, the rest are used as options.

        var cardToLearn = cards[0];

        //Add new attributes to the cardToLearn then add LearnDeck

        cardToLearn = _.extend(cardToLearn,{
            learnDeckType: learnDeckType,
            options: cards.map(function(card){
                return card.keyword;
            })
        });

        LearningDeck.insert(cardToLearn);

        return [cardToLearn];
    }
    else {
        return cardToLearns.fetch();
    }
};
/**
 * Created by myticmoon on 23/3/16.
 */
LearningDeck = new Meteor.Collection(null);

removeLearningDeck = function(cardId, deckType) {
    LearningDeck.remove({cardId: cardId, learnDeckType: deckType});
};

addLearningDeck = function(ids, deckType) {
    var cardToLearns =  ids.map(function(id) { return { cardId: id, attempt: 0, learnDeckType: deckType } });
    _.each(cardToLearns, function(cardToLearn) {
        LearningDeck.insert(cardToLearn);
    });
};

increaseAttempt = function(id, deckType) {
    var card = LearningDeck.findOne({cardId: id, learnDeckType: deckType});
    if(card.attempt == 2) {
        removeLearningDeck(id, deckType);
    }
    LearningDeck.update({cardId: id, learnDeckType: deckType}, {$inc: {attempt: 1}});
};
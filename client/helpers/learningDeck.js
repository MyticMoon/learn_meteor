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
    var learningCard = LearningDeck.findOne({cardId: id, learnDeckType: deckType});
    var card = Cards.findOne({_id: id});
    var score = 10;

    if (typeof card.memoryPoint != "undefined") {
        score = card.memoryPoint;
    }

    score -= 7;
    if(score < 0) {
        score = 0;
    }
    card.memoryPoint = score;
    Cards.update(id, {$set: card}, function(error) {
    });

    if(learningCard.attempt == 2) {
        removeLearningDeck(id, deckType);
    }
    else{
        LearningDeck.update({cardId: id, learnDeckType: deckType}, {$inc: {attempt: 1}});
    }
};

answerCorrect = function(id, deckType) {
    var card = Cards.findOne({_id: id});
    var score = 0;
    if (typeof card.memoryPoint != "undefined") {
        score = card.memoryPoint;
    }

    score += 30;
    if(score > 100) {
        score = 100;
    }
    card.memoryPoint = score;

    Cards.update(id, {$set: card}, function(error) {
    });

    removeLearningDeck(id, deckType);
};
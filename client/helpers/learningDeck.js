/**
 * Created by myticmoon on 23/3/16.
 */
LearningDeck = new Meteor.Collection(null);

removeLearningDeck = function(cardId, deckType, deckId) {
    LearningDeck.remove({cardId: cardId, learnDeckType: deckType, deckId: deckId});
};

//addLearningDeck = function(ids, deckType, deckId) {
//    var cardToLearns =  ids.map(function(id) { return { cardId: id, attempt: 0, learnDeckType: deckType, deckId: deckId } });
//    _.each(cardToLearns, function(cardToLearn) {
//        LearningDeck.insert(cardToLearn);
//    });
//};

increaseAttempt = function(id, deckType, deckId) {
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
    // Update memoryPoint and memoryPointHistory
    card.memoryPoint = score;
    card.memoryPointHistory.push({dateTime: new Date().getTime(), memoryPoint: score});
    Cards.update(id, {$set: card}, function(error) {
    });

    if(learningCard.attempt == 2) {
        removeLearningDeck(id, deckType, deckId);
    }
    else{
        LearningDeck.update({cardId: id, learnDeckType: deckType}, {$inc: {attempt: 1}});
    }
};

answerCorrect = function(id, deckType, deckId) {
    var card = Cards.findOne({_id: id});
    var score = 0;
    if (typeof card.memoryPoint != "undefined") {
        score = card.memoryPoint;
    }

    score += 30;
    if(score > 100) {
        score = 100;
    }
    // Update memoryPoint and memoryPointHistory
    card.memoryPoint = score;
    var memoryPointHistory = card.memoryPointHistory;
    memoryPointHistory.push({dateTime: new Date().getTime(), memoryPoint: score});

    Cards.update(id, {$set: {memoryPoint: score, memoryPointHistory: memoryPointHistory}}, function(error) {
    });

    removeLearningDeck(id, deckType, deckId);
};
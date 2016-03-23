/**
 * Created by myticmoon on 23/3/16.
 */
LearningDeck = new Meteor.Collection(null);

removeLearningDeck = function(carId) {
    LearningDeck.remove({cardId: carId});
};

addLearningDeck = function(ids) {
    var cardToLearns =  ids.map(function(id) { return { cardId: id, attempt: 0 } });
    _.each(cardToLearns, function(cardToLearn) {
        LearningDeck.insert(cardToLearn);
    });
};
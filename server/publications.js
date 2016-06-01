Meteor.publish('posts', function(options){
    return Posts.find({}, options);
});

Meteor.publish('decks', function(options){
    return Decks.find({}, options);
});

Meteor.publish('cards', function(options) {
    return Cards.find({}, options);
});

Meteor.publish('cardsInDeck', function(query ,sort, limit) {
    return Cards.find(query, {sort: sort, limit: limit});
});

Meteor.publish('marketPlace', function(options){
    return MarketPlace.find({}, options);
});

Meteor.publish('learnHistory', function(options){
    return LearnHistory.find({}, options);
});

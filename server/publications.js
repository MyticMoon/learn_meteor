Meteor.publish('posts', function(options){
    return Posts.find({}, options);
});

Meteor.publish('decks', function(options){
    return Decks.find({}, options);
});

Meteor.publish('decksInMarket', function(terms){
    var parameters = queryConstructor(terms);
    return MarketPlace.find(parameters.find, parameters.options);
});

Meteor.publish('marketPlace', function(options){
    return MarketPlace.find({}, options);
});

Meteor.publish('cards', function(options) {
    return Cards.find({}, options);
});

Meteor.publish('newCards', function(terms) {
    var parameters = queryConstructor(terms);
    return Cards.find(parameters.find, parameters.options);
});

Meteor.publish('learnHistory', function(options){
    return LearnHistory.find({}, options);
});

Meteor.publish('comments', function(marketDeckId){
    return Comments.find({marketDeckId: marketDeckId});
});

Meteor.publish('notifications', function(options){
    return Notifications.find({}, options);
});
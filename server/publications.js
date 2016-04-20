Meteor.publish('posts', function(options){
    return Posts.find({}, options);
});

Meteor.publish('decks', function(options){
    return Decks.find({}, options);
});

Meteor.publish('cards', function(options){
    return Cards.find({}, options);
});

Meteor.publish('marketPlace', function(options){
    return MarketPlace.find({}, options);
});

Meteor.publish('learnHistory', function(options){
    return LearnHistory.find({}, options);
});

Meteor.publish('posts', function(options){
    return Posts.find({}, options);
});

Meteor.publish('decks', function(options){
    return Decks.find({}, options);
});




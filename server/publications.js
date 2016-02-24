Meteor.publish('posts', function(options){
    return Posts.find({}, options);
});



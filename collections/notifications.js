Notifications = new Meteor.Collection('notifications');

Notifications.allow({
    update: ownsDocument
});

createCommentNotification = function(comment){
    var marketDeck = MarketPlace.findOne(comment.marketDeckId);
    if(comment.userId != marketDeck.userId) {
        Notifications.insert({
            userId: marketDeck.userId,
            marketDeckId: marketDeck._id,
            commentId: comment._id,
            commenterName: comment.author,
            read: false
        });
    }
};
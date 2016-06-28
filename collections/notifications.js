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
            userName: comment.author,
            read: false,
            type: "comment",
            notificationText: "commented on your deck"
        });
    }
};

createPurchaseNotification = function(purchase){
    var marketDeck = MarketPlace.findOne(purchase.marketDeckId);
    Notifications.insert({
        userId: marketDeck.userId,
        marketDeckId: marketDeck._id,
        buyerId: purchase.userId,
        userName: purchase.userName,
        read: false,
        type: "purchase",
        notificationText: "purchased your deck"
    });
};
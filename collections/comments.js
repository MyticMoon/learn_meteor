/**
 * Created by myticmoon on 18/6/16.
 */
Comments = new Meteor.Collection("comments");

Meteor.methods({
    comment: function(commentAttributes) {
        var user = Meteor.user();
        var marketDeck = MarketPlace.findOne(commentAttributes.marketDeckId); // ensure the user is logged in

        if (!user)
            throw new Meteor.Error(401, "You need to login to make comments");
        if (!commentAttributes.body)
            throw new Meteor.Error(422, 'Please write some content');
        if (!marketDeck)
            throw new Meteor.Error(422, 'You must comment on a post');

        marketDeck.commentsCount += 1;
        MarketPlace.update(marketDeck._id, {$set: marketDeck}, function(error){
            if(error){
                throwError(error.reason);
            }
        });

        comment = _.extend(_.pick(commentAttributes, 'marketDeckId', 'body'), { userId: user._id,
            author: user.username,
            submitted: new Date().getTime()
        });
        return Comments.insert(comment); }
});
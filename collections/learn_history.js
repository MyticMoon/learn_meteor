/**
 * Created by myticmoon on 21/3/16.
 */
LearnHistory = new Meteor.Collection('learnHistory');

Meteor.methods({
    postLearnHistory: function (postLearnAttributes) {
        var user = Meteor.user();

        if(!user)
            throw new Meteor.Error(401, "You need to login to learn cards");
        if(!postLearnAttributes.cardId || !postLearnAttributes.userInput || !postLearnAttributes.keyword)
        {
            throw new Meteor.Error(422, "Invalid learnHistory object");
        }

        var learnHistory = _.extend(_.pick(postLearnAttributes, 'cardId', 'userInput'),{
            userId: user._id,
            createdAt: new Date().getTime(),
            success: postLearnAttributes.userInput == postLearnAttributes.keyword
        });

        return LearnHistory.insert(learnHistory);

    }
});


LearnHistory.allow({
    insert: function(userId, doc) {
        return !!userId;
    },
    update: ownsDocument,
    remove: ownsDocument
});
Template.marketDeck.helpers({
    'isAuthor': function() {
        return Meteor.userId() == this.userId;
    },
    commentsCount: function () {
        return Comments.find({marketDeckId: this._id}).count();
    }
});
Template.marketDeckView.helpers({
    comments: function () {
        return Comments.find({marketDeckId: this._id});
    }
});
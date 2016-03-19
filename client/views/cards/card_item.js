Template.cardItem.helpers({
    ownCard: function()
    {
        if(Meteor.userId()){
            return this.userId = Meteor.userId();
        }
        return false;
    }
});
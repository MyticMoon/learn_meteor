Template.deckItem.helpers({
    ownDeck: function()
    {
        if(Meteor.userId()){
            return this.userId = Meteor.userId();
        }
        return false;
    }
});
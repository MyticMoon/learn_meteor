Template.deckItem.helpers({
    ownDeck: function()
    {
        if(Meteor.userId()){
            return this.userId = Meteor.userId();
        }
        return false;
    },
    cardCount: function()
    {
        var cards = Cards.find({deckId: this._id});
        return cards.count();
    }
});
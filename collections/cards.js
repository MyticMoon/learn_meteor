/**
 * Created by myticmoon on 5/3/16.
 */
Cards = new Meteor.Collection('cards');

Meteor.methods({
    postCard: function (cardAttributes) {
        var user = Meteor.user();

        if(!user)
            throw new Meteor.Error(401, "You need to login to create new decks");
        if(!cardAttributes.title || !cardAttributes.keyword || !cardAttributes.definition)
            throw new Meteor.Error(422, "Please fill with a headline");

        var card = _.extend(_.pick(cardAttributes, 'title', 'keyword', 'definition', 'deckId', 'type'), {
            userId: user._id,
            author: user.username,
            submitted: new Date().getTime(),
            memoryPoint: 10
        });

        var cardId = Cards.insert(card);
        return cardId;
    },

    addCardsToDeck: function(cardsInOriginalDeck) {
        var user = Meteor.user();

        if(!user)
            throw new Meteor.Error(401, "You need to login to add card to market");

        cardsInOriginalDeck.map(function(cardToMarket){
            Cards.insert(cardToMarket);
        });
    }
});

Cards.allow({
    insert: function(userId, doc) {
        return !!userId;
    },
    update: ownsDocument,
    remove: ownsDocument
});
Decks = new Meteor.Collection('decks');

Meteor.methods({
    postDeck: function (deckAttributes) {
        var user = Meteor.user();

        if(!user)
        throw new Meteor.Error(401, "You need to login to create new decks");
        if(!deckAttributes.title)
            throw new Meteor.Error(422, "Please fill with a headline");

        var deck = _.extend(_.pick(deckAttributes, 'title', 'type'), {
            userId: user._id,
            authorId: user._id,
            author: user.username,
            submitted: new Date().getTime(),
            version: 1,
            countCard: 0
        });

        return Decks.insert(deck);
    },

    postDeckToMarket: function(deckToMarket) {
        var user = Meteor.user();

        if(!user)
            throw new Meteor.Error(401, "You need to login to create new decks");
        if(!deckToMarket.title || !deckToMarket.originalDeckId || !deckToMarket.price)
            throw new Meteor.Error(422, "Please fill with a title");

        var originalDeck = Decks.findOne({_id: deckToMarket.originalDeckId});
        if(!originalDeck)
            throw new Meteor.Error(422, "Original deck can't be found");

        var deck = _.extend(_.pick(deckToMarket, 'title', 'description', 'price', 'originalDeckId', 'type'), {
            userId: user._id,
            authorId: user._id,
            author: user.username,
            submitted: new Date().getTime(),
            version: originalDeck.version,
            countCard: 0
        });

        return Decks.insert(deck);
    },

    purchaseDeck: function(deckToMarket) {
        var user = Meteor.user();

        if(!user)
            throw new Meteor.Error(401, "You need to login to create new decks");

        if(!deckToMarket.title || !deckToMarket.originalDeckId || !deckToMarket.price)
            throw new Meteor.Error(422, "Please fill with a title");

        var deck = _.extend(_.pick(deckToMarket, 'title', 'description', 'price', 'originalDeckId', 'originalMarketDeckId', 'type', 'author', 'authorId'), {
            userId: user._id,
            submitted: new Date().getTime(),
            version: originalMarketDeck.version,
            countCard: 0
        });

        return Decks.insert(deck);
    }

});

Decks.allow({
    insert: function(userId, doc) {
       return !!userId;
    },
    update: ownsDocument,
    remove: ownsDocument
});
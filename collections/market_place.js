MarketPlace = new Meteor.Collection('marketPlace');

Meteor.methods({
    postDeckToMarket: function(deckToMarket) {
        var user = Meteor.user();

        if(!user)
            throw new Meteor.Error(401, "You need to login to create new decks");
        if(!deckToMarket.title || !deckToMarket.originalDeckId || !deckToMarket.price)
            throw new Meteor.Error(422, "Please fill with a title");

        var originalDeck = Decks.findOne({_id: deckToMarket.originalDeckId});
        if(!originalDeck)
            throw new Meteor.Error(422, "Original deck can't be found");

        var deck = _.extend(_.pick(deckToMarket, 'title', 'description', 'price', 'originalDeckId', 'type', 'cardCount'), {
            userId: user._id,
            authorId: user._id,
            author: user.username,
            submitted: new Date().getTime(),
            version: originalDeck.version,
            commentsCount: 0,
            votes: {},
            rating: 3
        });

        return MarketPlace.insert(deck);
    },
    purchaseDeck: function(deckToMarket) {
        var user = Meteor.user();

        if(!user)
            throw new Meteor.Error(401, "You need to login to create new decks");

        if(!deckToMarket.title || !deckToMarket.originalDeckId || !deckToMarket.price)
            throw new Meteor.Error(422, "Please fill with a title");

        var originalMarketDeck = Decks.findOne({_id: deckToMarket.originalDeckId});

        if(!originalMarketDeck)
            throw new Meteor.Error(422, "Original deck can't be found");

        var deck = _.extend(_.pick(deckToMarket, 'title', 'description', 'price', 'originalDeckId', 'originalMarketDeckId', 'type', 'author', 'authorId'), {
            userId: user._id,
            submitted: new Date().getTime(),
            version: originalMarketDeck.version,
            countCard: 0
        });

        var purchase = {
            userId: user._id,
            userName: user.username,
            marketDeckId: deckToMarket.originalMarketDeckId
        };

        createPurchaseNotification(purchase);

        return Decks.insert(deck);
    }
});

MarketPlace.allow({
    insert: function(userId, doc) {
        return !!userId;
    },
    update: ownsDocument,
    remove: ownsDocument
});
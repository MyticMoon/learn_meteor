MarketPlace = new Meteor.Collection('marketPlace');

Meteor.methods({
    postToMarketPlace: function(itemAttributes) {
        var user = Meteor.user();

        if(!user)
            throw new Meteor.Error(401, "You need to login to create new decks");
        if(!itemAttributes.title || !itemAttributes.deckId || !itemAttributes.price)
            throw new Meteor.Error(422, "Missing item information");

        var itemInMarket = _.extend(_.pick(itemAttributes, "title", "price", "description"), {
            userId: user._id,
            author: user.username,
            submitted: new Date().getTime()
        });

        return MarketPlace.insert(itemInMarket);
    }
});

MarketPlace.allow({
    insert: function(userId, doc) {
        return !!userId;
    },
    update: ownsDocument,
    remove: ownsDocument
});
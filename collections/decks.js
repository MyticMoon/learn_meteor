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
            cardCount: 0
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
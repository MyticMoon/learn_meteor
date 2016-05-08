Template.marketDeck.events({
    'submit form': function(e) {
        e.preventDefault();

        var user = Meteor.user();
        if(!user)
            throw new Meteor.Error(401, "You need to login to purchase deck from market");

        var marketDeckId = $(e.target).find('[name=deckId]').val();

        var deckInMarket = Decks.find({_id: marketDeckId, type: 'marketDeck'});
        if(deckInMarket.count() == 0)
        {
            alert("Deck couldn't be found in market");
            throw new Meteor.Error(422, "Deck couldn't be found in market");
        }

        var deckToUser = {
            title: $(e.target).find('[name=title]').val(),
            description: $(e.target).find('[name=description]').val(),
            price: $(e.target).find('[name=price]').val(),
            originalDeckId: $(e.target).find('[name=originalDeckId]').val(),
            author: $(e.target).find('[name=author]').val(),
            authorId: $(e.target).find('[name=authorId]').val(),
            originalMarketDeckId: marketDeckId,
            type: "purchasedDeck"
        };

        Meteor.call('purchaseDeck', deckToUser, function (error, id) {
            if(error) {
                throwError(error.reason);
            }
            else {
                var currentDeckId = Session.get('currentDeckId');
                var cardsInOriginalDeck = Cards.find({deckId: currentDeckId});

                var cardsToMarket =  cardsInOriginalDeck.map(function(card){
                    var purchasedCard = _.extend(_.pick(card, 'title', 'keyword', 'definition', 'version', 'author', 'authorId', 'descriptionPhoto'), {
                        deckId: id,
                        userId: user._id,
                        type: "marketCard",
                        originalCardId: card._id,
                        submitted: new Date().getTime(),
                        memoryPoint: 0
                    });
                    return purchasedCard;
                });

                Meteor.call('addCardsToDeck', cardsToMarket, function(error){
                    if(error) {
                        throwError(error.reason);
                    }
                    else {
                        alert('Purchased successfully');
                        Router.go('cardsList', {_id: currentDeckId});
                    }
                });
            }
        });
    }
});
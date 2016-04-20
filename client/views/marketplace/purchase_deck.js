Template.marketDeck.events({
    'submit form': function(e) {
        e.preventDefault();
        var marketDeckId = $(e.target).find('[name=marketDeckId]').val();

        var deckInMarket = Decks.find({_id: marketDeckId, type: 'marketDeck'});
        if(deckInMarket.count() != 0)
        {
            alert("Deck couldn't be found in market");
            throw new Meteor.Error(422, "Deck couldn't be found in market");
        }

        var deckToUser = {
            title: $(e.target).find('[name=title]').val(),
            description: $(e.target).find('[name=description]').val(),
            price: $(e.target).find('[name=price]').val(),
            originalDeckId: $(e.target).find('[name=originalDeckId]').val(),
            originalMarketDeckId: marketDeckId,
            type: "purchasedDeck"
        };

        Meteor.call('purchaseDeck', deckToMarket, function (error, id) {
            if(error) {
                throwError(error.reason);
            }
            else {
                var currentDeckId = Session.get('currentDeckId');
                var cardsInOriginalDeck = Cards.find({deckId: currentDeckId});

                var cardsToMarket =  cardsInOriginalDeck.map(function(card){
                    var cardToMarket = _.extend(_.pick(card, 'title', 'keyword', 'definition', 'version', 'author', 'userId'), {
                        deckId: id,
                        type: "marketCard",
                        originalCardId: card._id,
                        submitted: new Date().getTime(),
                        memoryPoint: 0
                    });
                    return cardToMarket;
                });

                Meteor.call('addCardsToDeck', cardsToMarket, function(error){
                    if(error) {
                        throwError(error.reason);
                    }
                    else {
                        Router.go('cardsList', {_id: currentDeckId});
                    }
                });
            }
        });
    }
});
/**
 * Created by myticmoon on 9/4/16.
 */
Template.deckToMarket.events({
    'submit form': function(e) {
        e.preventDefault();
        var currentDeckId = Session.get('currentDeckId');

        var deckInMarket = Decks.find({originalDeckId: currentDeckId, type: 'marketDeck'}).fetch();
        if(deckInMarket.lenght != 0)
        {
            sAlert.warning("Deck was published before");
            throw new Meteor.Error(422, "Deck was published before");
        }

        //TODO: put data validation here
        var deckToMarket = {
            title: $(e.target).find('[name=title]').val(),
            description: $(e.target).find('[name=description]').val(),
            price: $(e.target).find('[name=price]').val(),
            cardCount: $(e.target).find('[name=cardCount]').val(),
            originalDeckId: currentDeckId,
            type: "marketDeck"
        };

        //clear input fields
        //$(e.target).find('[name=title]').val('');
        //$(e.target).find('[name=description]').val('');
        //$(e.target).find('[name=price]').val('');

        Meteor.call('postDeckToMarket', deckToMarket, function (error, id) {
            if(error) {
                throwError(error.reason);
            }
            else {
                var currentDeckId = Session.get('currentDeckId');
                var cardsInOriginalDeck = Cards.find({deckId: currentDeckId});

                var cardsToMarket =  cardsInOriginalDeck.map(function(card){
                    var cardToMarket = _.extend(_.pick(card, 'title', 'keyword', 'definition', 'version', 'author', 'userId', 'descriptionPhoto', 'descriptionPhotoPath'), {
                        deckId: id,
                        type: "marketCard",
                        originalCardId: card._id,
                        submitted: new Date().getTime(),
                        memoryPoint: 10
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
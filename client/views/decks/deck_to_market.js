/**
 * Created by myticmoon on 9/4/16.
 */
Template.deckToMarket.events({
    'submit form': function(e) {
        e.preventDefault();
        var currentDeckId = Session.get('currentDeckId');

        //TODO: put data validation here
        var deckToMarket = {
            title: $(e.target).find('[name=title]').val(),
            description: $(e.target).find('[name=description]').val(),
            price: $(e.target).find('[name=price]').val(),
            originalDeckId: currentDeckId,
            type: "marketDeck"
        };

        //clear input fields
        $(e.target).find('[name=title]').val('');
        $(e.target).find('[name=description]').val('');
        $(e.target).find('[name=price]').val('');

        Meteor.call('postDeckToMarket', deckToMarket, function (error, id) {
            if(error) {
                throwError(error.reason);
            }
            else {
                var currentDeckId = Session.get('currentDeckId');
                var cardsInOriginalDeck = Cards.find({deckId: currentDeckId});

                Meteor.call('postCardsToMarket', cardsInOriginalDeck, function(error){
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
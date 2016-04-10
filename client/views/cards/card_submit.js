Template.cardsList.events({
    'submit form': function(e) {
        e.preventDefault();
        var currentDeckId = Session.get('currentDeckId');
        var card = {
            title: $(e.target).find('[name=title]').val(),
            keyword: $(e.target).find('[name=keyword]').val(),
            definition: $(e.target).find('[name=definition]').val(),
            deckId: currentDeckId,
            type: "personalCard"
        };

        //clear input fields
        $(e.target).find('[name=title]').val('');
        $(e.target).find('[name=keyword]').val('');
        $(e.target).find('[name=definition]').val('');

        Meteor.call('postCard', card, function (error, id) {
            if (error){
                throwError(error.reason);
                if(error.error === 302) {
                    //Router.go('postPage', {_id: error.details}, {});
                }
            } else {
                Router.go('cardsList', {_id: currentDeckId});
            }
        });
    }
});
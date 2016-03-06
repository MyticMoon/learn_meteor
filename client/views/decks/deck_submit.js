
Template.decksList.events({
    'submit form': function(e) {
        alert("clicked");
        e.preventDefault();
        var deck = {
            title: $(e.target).find('[name=title]').val()
        };

        Meteor.call('postDeck', deck, function (error, id) {
            if (error){
                throwError(error.reason);
                if(error.error === 302) {
                    //Router.go('postPage', {_id: error.details}, {});
                }
            } else {
            }
        });
    }
});
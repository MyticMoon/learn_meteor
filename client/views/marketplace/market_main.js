Template.marketMain.helpers({
    'marketDeckList': function() {
        var decks =  MarketPlace.find({type: "marketDeck"});
        return decks;
    },
    textQuery: function() {
        return Session.get('marketMainTextQuery');
    }
});

Template.marketMain.events({
    'keyup [name=search_field]': _.debounce(function(event, template) {
        event.preventDefault();
        Session.set('marketMainTextQuery', template.find('[name=search_field]').value);
    }, 500)
});

Template.decksList.helpers({
    decks: function() {
        var decks = Decks.find({userId: Meteor.userId()}, {sort: {submitted: -1}});

        //decks.forEach(function(element, index, array){
        //    element.countCard = Cards.find({deckId: element._id}).count();
        //})

        //for(var i = 0; i < decks.count(); i++) {
        //    decks[i].countCard = Cards.find({deckId: decks[i]._id}).count();
        //}

        return decks;
    }
});
Meteor.methods({
    submitRating: function(userRating, deckId){
        var user = Meteor.user();

        var marketDeck = MarketPlace.findOne({_id: deckId});
        var votes = marketDeck.votes || {};
        votes[user._id] = userRating;
        var sum = 0;
        for(var key in votes) {
            sum += votes[key];
        }

        marketDeck.rating = sum/Object.keys(votes).length;
        marketDeck.votes = votes;
        var newRating = {
            votes: votes,
            rating: sum/Object.keys(votes).length
        };
        console.log(newRating);
        MarketPlace.update(marketDeck._id, {
            $set: marketDeck
        }, function(error, response) {
            if(error) {
                console.log(error);
            }
        });

    }
});
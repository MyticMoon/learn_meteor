Template.learnPage.helpers({
    'cardsLearn': function(){
        var cardToLearns = LearningDeck.find();
        var cards = [];
        var listOfCardIds = [];
        if(cardToLearns.count() == 0) {
            var decks = Decks.find({userId: Meteor.userId()});
            var listOfDecksId = decks.map(function(element){return element._id;});
            cards = Cards.find({deckId: {$in: listOfDecksId}});
            listOfCardIds = cards.map(function(card) {return card._id});
            addLearningDeck(listOfCardIds);
            return cards;
        }
        else {
            listOfCardIds = cardToLearns.map(function(cardToLearn) {return cardToLearn.cardId});
            cards = Cards.find({_id: {$in: listOfCardIds}});
            return cards;
        }

    }
});

Template.cardLearn.events({
    'submit form': function(e) {
        e.preventDefault();
        //var currentDeckId = Session.get('currentDeckId');
        var learnHistory = {
            cardId: $(e.target).find('[name=cardId]').val(),
            userInput: $(e.target).find('[name=userInput]').val(),
            keyword: $(e.target).find('[name=keyword]').val()
        };

        if(learnHistory.userInput == learnHistory.keyword){
            alert("Correct");
            removeLearningDeck(learnHistory.cardId);
        }
        else{
            alert("Incorrect");
        }

        //clear input fields
        $(e.target).find('[name=userInput]').val('');

        Meteor.call('postCard', card, function (error, id) {
            if (error){
                throwError(error.reason);
                if(error.error === 302) {
                    //Router.go('postPage', {_id: error.details}, {});
                }
            } else {
                //Router.go('cardsList', {_id: currentDeckId});
            }
        });
    }
});
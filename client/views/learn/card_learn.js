Template.learnPage.helpers({
    'cardsLearn': function(){
        var cardToLearns = LearningDeck.find({learnDeckType: "mainLearnPage"});
        var cards = [];
        var listOfCardIds = [];
        if(cardToLearns.count() == 0) {
            var decks = Decks.find({userId: Meteor.userId()});
            var listOfDecksId = decks.map(function(element){return element._id;});
            cards = Cards.find({deckId: {$in: listOfDecksId}});
            cards = randomizeCard(cards, 4);
            listOfCardIds = cards.map(function(card) {return card._id});
            addLearningDeck(listOfCardIds, "mainLearnPage");
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
        var learnHistory = {
            cardId: $(e.target).find('[name=cardId]').val(),
            userInput: $(e.target).find('[name=userInput]').val(),
            keyword: $(e.target).find('[name=keyword]').val()
        };

        if(learnHistory.userInput == learnHistory.keyword){
            alert("Correct");
            answerCorrect(learnHistory.cardId, "mainLearnPage");
        }
        else{
            alert("Incorrect");
            increaseAttempt(learnHistory.cardId, "mainLearnPage");
        }
    }
});

randomizeCard = function(cardList, numberOfCards) {
    cardList = cardList.map(function(card) { card.randomPoint = card.memoryPoint * Math.random(); return card; });
    cardList = cardList.sort(function(a, b) {return a.randomPoint < b.randomPoint;});
    cardList = cardList.splice(numberOfCards);
    return cardList;
};
Template.learnPage.helpers({
    'cardsLearn': function(){
        return getCardsToLearn("mainLearnPage");
    }
});

Template.cardLearn.events({
    'submit form': function(e) {
        e.preventDefault();
        checkUserAnswer(e, "mainLearnPage");
    }
});

Template.learnDeck.helpers({
    'cardsLearn': function() {
        var currentLearningDeck = Session.get('currentLearningDeck');
        return getCardsToLearn(currentLearningDeck);
    }
});

Template.learnCardOneDeck.events({
    'submit form': function(e) {
        e.preventDefault();
        var currentLearningDeck = Session.get('currentLearningDeck');
        checkUserAnswer(e, currentLearningDeck);
    }
});

checkUserAnswer = function(e, learnDeckType) {
    var learnHistory = {
        cardId: $(e.target).find('[name=cardId]').val(),
        userInput: $(e.target).find('[name=userInput]').val(),
        keyword: $(e.target).find('[name=keyword]').val()
    };

    if(learnHistory.userInput == learnHistory.keyword){
        alert("Correct");
        answerCorrect(learnHistory.cardId, learnDeckType);
    }
    else{
        alert("Incorrect");
        increaseAttempt(learnHistory.cardId, learnDeckType);
    }
};


getCardsToLearn = function(learnDeckType) {
    var cardToLearns = LearningDeck.find({learnDeckType: learnDeckType});
    var cards = [];
    var listOfCardIds = [];
    if(cardToLearns.count() == 0) {
        var decks = [];
        if(learnDeckType === "mainLearnPage") {
            decks = Decks.find({userId: Meteor.userId()});
        }
        else {
            decks = Decks.find({userId: Meteor.userId(), _id: learnDeckType});
        }
        var listOfDecksId = decks.map(function(element){return element._id;});
        cards = Cards.find({deckId: {$in: listOfDecksId}});
        cards = randomizeCard(cards, 4);
        listOfCardIds = cards.map(function(card) {return card._id});
        addLearningDeck(listOfCardIds, learnDeckType);
        return cards;
    }
    else {
        listOfCardIds = cardToLearns.map(function(cardToLearn) {return cardToLearn.cardId});
        cards = Cards.find({_id: {$in: listOfCardIds}});
        return cards;
    }
};

randomizeCard = function(cardList, numberOfCards) {
    cardList = cardList.map(function(card) { card.randomPoint = card.memoryPoint * Math.random(); return card; });
    cardList = cardList.sort(function(a, b) {return a.randomPoint < b.randomPoint;});
    if(cardList.length < numberOfCards)
    {
        numberOfCards = cardList.length;
    }
    cardList = cardList.slice(0, numberOfCards);
    return cardList;
};
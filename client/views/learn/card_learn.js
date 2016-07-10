Template.learnPage.helpers({
    'cardsLearn': function(){
        return getCardsToLearn("mainLearnPage", 0);
    }
});

Template.cardLearn.events({
    'submit form': function(e) {
        e.preventDefault();
        checkUserAnswer(e, "mainLearnPage", 0);
    }
});

Template.learnDeck.helpers({
    'cardsLearn': function() {
        var learningDeckId = Session.get('learningDeckId');
        var learningDeckType = Session.get('learningDeckType');
        return getCardsToLearn(learningDeckType, learningDeckId);
    }
});

Template.learnCardOneDeck.events({
    'submit form': function(e) {
        e.preventDefault();
        var learningDeckId = Session.get('learningDeckId');
        var learningDeckType = Session.get('learningDeckType');
        checkUserAnswer(e, learningDeckType, learningDeckId);
    }
});

checkUserAnswer = function(e, learnDeckType, deckId) {

    if(learnDeckType === "MCQ") {
        var userInput = $(e.target).find('[name=userInput]:checked').val();
    }
    else{
        userInput = $(e.target).find('[name=userInput]').val();
    }

    var learnHistory = {
        cardId: $(e.target).find('[name=cardId]').val(),
        userInput: userInput,
        keyword: $(e.target).find('[name=keyword]').val()
    };

    if(learnHistory.userInput == learnHistory.keyword){
        sAlert.error('Correct');
        answerCorrect(learnHistory.cardId, learnDeckType, deckId);
    }
    else{
        sAlert.error('Incorrect');
        increaseAttempt(learnHistory.cardId, learnDeckType, deckId);
    }
};


getCardsToLearn = function(learnDeckType, deckId) {
    var cardToLearns = LearningDeck.find({learnDeckType: learnDeckType, deckId: deckId});
    var cards = [];
    var listOfCardIds = [];
    if(cardToLearns.count() == 0) {
        var decks = [];
        if(learnDeckType === "mainLearnPage") {
            decks = Decks.find({userId: Meteor.userId()});
        }
        else {
            decks = Decks.find({userId: Meteor.userId(), _id: deckId});
        }
        var listOfDecksId = decks.map(function(element){return element._id;});
        cards = Cards.find({deckId: {$in: listOfDecksId}});
        cards = randomizeCard(cards, 1);
        //listOfCardIds = cards.map(function(card) {return card._id});
        //addLearningDeck(listOfCardIds, learnDeckType, deckId);
        //return cards;

        cards = cards.map(function(card) {
             card = _.extend(card,{
                 learnDeckType: learnDeckType,
                 attempt: 0,
                 cardId: card._id
            });
            delete card._id;
            return card;
        });

        cards.map(function(card) {
            LearningDeck.insert(card);
        });
        return cards;
    }
    else {
        //listOfCardIds = cardToLearns.map(function(cardToLearn) {return cardToLearn.cardId});
        //cards = Cards.find({_id: {$in: listOfCardIds}});
        //return cards;
        return cardToLearns.fetch();
    }
};

randomizeCard = function(cardList, numberOfCards) {
    cardList = cardList.map(function(card) { card.randomPoint = card.memoryPoint * Math.random(); return card; });
    cardList = cardList.sort(function(a, b) {return a.randomPoint > b.randomPoint;});
    if(cardList.length < numberOfCards)
    {
        numberOfCards = cardList.length;
    }
    cardList = cardList.slice(0, numberOfCards);
    return cardList;
};
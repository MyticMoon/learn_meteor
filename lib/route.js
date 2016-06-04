//this make me feel like this is the controller
Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function() { return [Meteor.subscribe('posts'), Meteor.subscribe('decks')];  }
});

var requireLogin = function(){
    if(!Meteor.user()) {
        this.render('accessDenied');
        this.stop();
    }
    else {
        this.next();
    }
};

Router.onBeforeAction(requireLogin, {only: ['postSubmit']});
Router.onBeforeAction(function(){
    clearErrors();
    this.next();
});

//CardsListController = RouteController.extend({
//    template: 'cardsList',
//    increment: 2,
//    cardsLimit: function() {
//        return parseInt(this.params.cardLimit) || this.increment;
//    },
//    findOptions: function() {
//        return {sort:{ submitted: -1 },limit: this.cardsLimit()};
//    },
//    waitOn: function() {
//        var cardLimit = parseInt(this.params.cardLimit) || this.increment;
//        var terms = {
//            viewName: 'newCards',
//            limit: 20
//        };
//        return [Meteor.subscribe('decks', {_id: this.params._id}), Meteor.subscribe('cards', {} )];
//    },
//    data: function() {
//        Session.set('currentDeckId', this.params._id);
//        var cardLimit = parseInt(this.params.cardLimit) || this.increment;
//        return {
//            cards: Cards.find({deckId: this.params._id}, {limit: cardLimit}),
//            nextPath: this.route.path({_id: this.params._id, cardLimit: this.cardsLimit() + this.increment})
//        };
//    }
//});


CardsListController = RouteController.extend({
    template: 'cardsList',
    increment: 5,
    cardsLimit: function() {
        return parseInt(this.params.cardLimit) || this.increment;
    },
    findOptions: function() {
        return {sort:{ submitted: -1 },limit: this.cardsLimit()};
    },
    waitOn: function() {
        var cardLimit = parseInt(this.params.cardLimit) || this.increment;
        var terms = {
            viewName: 'cardsInDeck',
            limit: cardLimit,
            deckId: this.params._id
        };
        return [Meteor.subscribe('decks', {_id: this.params._id}), Meteor.subscribe('newCards', terms)];
    },
    data: function() {
        Session.set('currentDeckId', this.params._id);
        var cardLimit = parseInt(this.params.cardLimit) || this.increment;
        var terms = {
            viewName: 'cardsInDeck',
            limit: cardLimit,
            deckId: this.params._id
        };
        var params = queryConstructor(terms);
        return {
            cards: Cards.find(params.find, params.options),
            nextPath: this.route.path({_id: this.params._id, cardLimit: this.cardsLimit() + this.increment})
        };
    }
});

Router.route('/deck/viewcards/:_id/:cardLimit?',
    {
        path: '/deck/viewcards/:_id/:cardLimit?',
        name: 'cardsList',
        controller: CardsListController
    }
);

//Router.route('/deck/viewcards/:_id/:cardLimit?',
//    {
//        path: '/deck/viewcards/:_id/:cardLimit?',
//        name: 'cardsList',
//        waitOn: function() {
//            var cardLimit = parseInt(this.params.cardLimit) || 5;
//            return [Meteor.subscribe('decks', {id: this.params._id}), Meteor.subscribe('cards', {limit: cardLimit})];
//        },
//        data: function() {
//            Session.set('currentDeckId', this.params._id);
//            var cardLimit = parseInt(this.params.cardLimit) || 1;
//            return Cards.find({deckId: this.params._id}, {limit: cardLimit});
//        }
//    }
//);

Router.route('/market',
    {
        name: 'marketMain',
        waitOn: function() {
            return [Meteor.subscribe('decks', {}), Meteor.subscribe('cards', {})];
        }
    }
);

Router.route('/',
    {
        name: 'learnPage',
        waitOn: function() {
            return [Meteor.subscribe('decks', {}), Meteor.subscribe('cards', {})];
        },
        data: function() {
            var decks = Decks.find({userId: Meteor.userId()});
            var listOfDecksId = decks.map(function(element){return element._id;});
            var cards = Cards.find({deckId: {$in: listOfDecksId}});
            return cards;
        }
    }
);

Router.route('/deck/learn/:_id',
    {
        name: 'learnDeck',
        waitOn: function() {
            return [Meteor.subscribe('decks', {id: this.params._id}), Meteor.subscribe('cards', {})];
        },
        data: function() {
            Session.set('currentLearningDeck', this.params._id);
        }
    }
);

Router.route('decks/:_id/edit',
    {
        name: 'deckEdit',
        waitOn: function () {
            return [Meteor.subscribe('decks', {id: this.params._id}), Meteor.subscribe('cards', {deckId: this.params._id})];
        },
        data: function() {
            Session.set('currentDeckId', this.params._id);
            return Decks.findOne({_id: this.params._id});
        }
    });

Router.route('decks/:_id/publishToMarket',
    {
        name: 'deckToMarket',
        waitOn: function () {
            return [Meteor.subscribe('decks', {id: this.params._id}), Meteor.subscribe('cards', {deckId: this.params._id})];
        },
        data: function() {
            Session.set('currentDeckId', this.params._id);
            return Decks.findOne({_id: this.params._id});
        }
    });

Router.route('cards/:_id/edit',
    {
        name: 'cardEdit',
        waitOn: function () {
            return Meteor.subscribe('cards', {id: this.params._id});
        },
        data: function() {
            Session.set('currentCardId', this.params._id);
            return Cards.findOne({_id: this.params._id});
        }
    });

Router.route('/posts/:_id',
    {
        name: 'postPage',
        waitOn: function () {
            return Meteor.subscribe('posts', {id: this.params._id});
        },
        data: function () {
            Session.set('currentPostId', this.params._id);
            return Posts.findOne({_id: this.params._id});
        }
    }
);

Router.route('/posts/:_id/edit',
    {
        name: 'postEdit',
        waitOn: function () {
            return Meteor.subscribe('posts', {id: this.params._id});
        },
        data: function() {
            Session.set('currentPostId', this.params._id);
            return Posts.findOne({_id: this.params._id});
        }
    });

Router.route('/submit',
    {
        name: 'postSubmit'
    }
);

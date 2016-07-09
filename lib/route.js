//this make me feel like this is the controller
Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function() { return [Meteor.subscribe('notifications'), Meteor.subscribe('userData')] }
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

CardsListController = RouteController.extend({
    template: 'cardsList',
    loadingTemplate: 'loading',
    onAfterAction: function(){
        $('[name=search_field]').focus();
    },
    increment: 5,
    cardsLimit: function() {
        return parseInt(this.params.cardLimit) || this.increment;
    },
    waitOn: function() {
        var textQuery = Session.get(this.params._id + "textQuery");
        var terms = {
            viewName: 'cardsInDeck',
            limit: this.cardsLimit(),
            deckId: this.params._id,
            textQuery: textQuery
        };
        return [Meteor.subscribe('decks', {_id: this.params._id}), Meteor.subscribe('newCards', terms)];
    },
    data: function() {
        Session.set('currentDeckId', this.params._id);

        var terms = {
            viewName: 'cardsInDeck',
            limit: this.cardsLimit(),
            deckId: this.params._id
            //textQuery: this.params.textQuery
        };
        var params = queryConstructor(terms);
        return {
            cards: Cards.find({}, params.options),
            nextPath: this.route.path({_id: this.params._id, cardLimit: this.cardsLimit() + this.increment })
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

MarketController = RouteController.extend({
    template: 'marketMain',
    loadingTemplate: 'loading',
    onAfterAction: function(){
        $('[name=search_field]').focus();
    },
    increment: 10,
    deckLimit: function() {
        return parseInt(this.params.deckLimit) || this.increment;
    },
    waitOn: function() {
        var textQuery = Session.get("marketMainTextQuery");
        var terms = {
            viewName: 'decksInMarket',
            limit: this.deckLimit(),
            textQuery: textQuery
        };

        return [Meteor.subscribe('decksInMarket', terms), Meteor.subscribe('decks'), Meteor.subscribe('cards'), Meteor.subscribe('comments')]
    },
    data: function() {
        var textQuery = Session.get("marketMainTextQuery");
        var terms = {
            viewName: 'decksInMarket',
            limit: this.deckLimit(),
            textQuery: textQuery
        };
        var params = queryConstructor(terms);
        return {
            decks: MarketPlace.find({}, params.options),
            nextPath: this.route.path({deckLimit: this.deckLimit() + this.increment, textQuery: textQuery })
        };
    }
});

Router.route('/market/:deckLimit?',
    {
        path: '/market/:deckLimit?',
        name: 'marketMain',
        controller: MarketController
    }
);

Router.route('market/deck/:_id',
    {
        name: 'marketDeckView',
        waitOn: function () {
            return [Meteor.subscribe('marketPlace'), Meteor.subscribe('decks'),  Meteor.subscribe('comments', this.params._id)];
        },
        data: function() {
            Session.set('marketDeckId', this.params._id);
            return MarketPlace.findOne({_id: this.params._id});
        }
    });

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

Router.route('/card/learningCurve/:_id',
    {
        name: 'learningCurve',
        waitOn: function() {
            return [Meteor.subscribe('decks'), Meteor.subscribe('cards', {id: this.params._id})];
        },
        data: function() {
            Session.set('currentCardId', this.params._id);
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
            Session.set('learningDeckId', this.params._id);
            Session.set('learningDeckType', "SingleDeck");
        }
    }
);

Router.route('/deck/learnMCQ/:_id',
    {
        name: 'learnDeckMCQ',
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
            return [Meteor.subscribe('decks'), Meteor.subscribe('cards', {id: this.params._id})];
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

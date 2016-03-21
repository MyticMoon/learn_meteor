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

Router.route('/deck/viewcards/:_id',
    {
        name: 'cardsList',
        waitOn: function() {
            return [Meteor.subscribe('decks', {id: this.params._id}), Meteor.subscribe('cards', {deckId: this.params._id})];
        },
        data: function() {
            Session.set('currentDeckId', this.params._id);
            return Cards.find({deckId: this.params._id});
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

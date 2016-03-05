//this make me feel like this is the controller
Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function() { return Meteor.subscribe('posts'); }
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
        name: 'postsList'
    }
    , function(){
    this.render('postsList');
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
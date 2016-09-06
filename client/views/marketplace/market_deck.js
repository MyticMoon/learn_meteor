Template.marketDeck.helpers({
    'isAuthor': function() {
        return Meteor.userId() == this.userId;
    },
    'voteable': function() {
        return Meteor.userId();
    }
});
//
//Template.marketDeck.events({
//    '.starRating onChange': function(e) {
//        alert("working");
//    }
//});
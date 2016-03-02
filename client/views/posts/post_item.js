Template.postItem.helpers({
    ownPost: function(){
        if(Meteor.userId())
        {
            return this.userId == Meteor.userId();
        }
        return false;
    },
    domain: function(){
        var a = document.implementation.createHTMLDocument('a');
        a.href = this.url;
        return a.hostname;
    }
});

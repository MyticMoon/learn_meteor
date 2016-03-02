Template.postItem.helpers({
    ownPost: function(){
        if(Meteor.userId())
        {
            return this.userId == Meteor.userId();
        }
        return false;
    },
    domain: function(){
        var a = document.createDocument('a');
        a.href = this.url;
        return a.hostname;
    }
});

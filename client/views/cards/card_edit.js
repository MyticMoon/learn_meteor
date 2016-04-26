Template.cardEdit.helpers({
    card: function() {
        return Cards.findOne(Session.get('currentCardId'));
    }
});

Template.cardEdit.events({
    'submit form': function(e) {
        e.preventDefault();
        var currentCardId = Session.get('currentCardId');
        var currentDeckId = Session.get('currentDeckId');
        var card = {
            title: $(e.target).find('[name=title]').val(),
            keyword: $(e.target).find('[name=keyword]').val(),
            definition: $(e.target).find('[name=definition]').val()
        };

        Cards.update(currentCardId, {$set: card}, function(error) {
            if (error){
                throwError(error.reason);
                if(error.error === 302) {
                    //Router.go('postPage', {_id: error.details}, {});
                }
            } else {
                Router.go('cardsList', {_id: currentDeckId});
            }
        });
    },

    'click .delete': function(e) { e.preventDefault();
        if (confirm("Delete this card?")) {
            var currentDeckId = Session.get('currentDeckId');
            var currentCardId = Session.get('currentCardId');
            Cards.remove(currentCardId);
            Router.go('cardsList', {_id: currentDeckId});
    } }
});

Template.s3_tester.events({
    "click button.upload": function(){
        var files = $("input.file_bag")[0].files;

        S3.upload({
            files:files,
            path:"subfolder"
        },function(e,r){
            console.log(r);
        });
    }
});

Template.s3_tester.helpers({
    "files": function(){
        return S3.collection.find();
    }
});
Template.postEdit.helpers({
    post: function() {
        return Posts.findOne(Session.get('currentPostId'));
    }
});

Template.postEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var currentPostId = Session.get('currentPostId');

        var postProperties = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val()
        };

        Posts.update(currentPostId, {$set: postProperties}, function (error) {
            if (error) {
                sAlert.warning(error.reason);
            } else {
                Router.go('postPage', {_id: currentPostId});
            }
        })
    },

    'click .delete': function(e)
    {
        e.preventDefault();

        if(confirm("Delete this post?")) {
            var currentPostId = Session.get('currentPostId');
            Posts.remove(currentPostId);
            Router.go('postsList');
        }
    }
});
Template.cardEdit.helpers({
    card: function() {
        return Cards.findOne(Session.get('currentCardId'));
    },

    finishedUpload: function() {
        var cardId = Session.get('currentCardId');
        if(Session.get(cardId + 'finishUpload')) {
            $('#description_image').attr('src', Session.get('tmpPhoto'));
            $('#description_image').css('visibility', 'visible');
            $('#description_image').cropper({
                aspectRatio: 16 / 9,
                crop: function(e) {
                    // Output the result data for cropping image.
                    console.log(e.x);
                    console.log(e.y);
                    console.log(e.width);
                    console.log(e.height);
                    console.log(e.rotate);
                    console.log(e.scaleX);
                    console.log(e.scaleY);
                }
            });
        }
        return Session.get(cardId + 'finishUpload');
    },

    tmpPhoto: function() {
        var cardId = Session.get('currentCardId');
        return Session.get(cardId + 'tmpPhoto');
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
    } },

    "click button.upload": function(){
        alert("clicked");
        var file = $("input.file_bag")[0].files[0];
        if(file.size > 5000000)
        {
            alert("The image is too big.");
            return;
        }

        S3.upload({
            files:[file],
            path:"tmp"
        },function(e,r){
            if(e == null) {
                var cardId = Session.get('currentCardId');
                Session.set(cardId + 'finishUpload', true);
                Session.set(cardId + 'tmpPhoto', r.secure_url);
                $('#description_image').attr('src', r.secure_url);
                $('#image_crop').css('visibility', 'visible');
                $('#description_image').cropper({
                    aspectRatio: 1,
                    crop: function(e) {
                        // Output the result data for cropping image.
                        console.log(e.x);
                        console.log(e.y);
                        console.log(e.width);
                        console.log(e.height);
                        console.log(e.rotate);
                        console.log(e.scaleX);
                        console.log(e.scaleY);
                    }
                });
            }
            else{
                alert("Upload has failed");
            }
        });
    }
});

Template.s3_tester.helpers({
    "files": function(){
        return S3.collection.find();
    }
});

//Template.s3_tester.events({
//    "click button.upload": function(){
//        alert("clicked");
//        var file = $("input.file_bag")[0].files[0];
//        if(file.size > 500000000)
//        {
//            alert("The image is too big.");
//            return;
//        }
//
//        S3.upload({
//            files:file,
//            path:"subfolder"
//        },function(e,r){
//            console.log(r);
//        });
//    }
//});


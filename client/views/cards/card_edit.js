Template.cardEdit.helpers({
    card: function() {
        return Cards.findOne(Session.get('currentCardId'));
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
            definition: $(e.target).find('[name=definition]').val(),
            descriptionPhoto: $(e.target).find('[name=descriptionPhoto]').val()
        };

        var currentDescriptionPhoto = Session.get(currentCardId + "descriptionPhoto");
        if(currentDescriptionPhoto != null) {
            if(card.descriptionPhoto != null) {
                S3.delete(card.descriptionPhotoPath, function(e, r){});
            }
            card.descriptionPhoto = currentDescriptionPhoto;
            card.descriptionPhotoPath = Session.get(currentCardId + "descriptionPhotoPath");
            //remove photo URL in session after save it
            Session.set(currentCardId + "descriptionPhoto", null);
            Session.set(currentCardId + "descriptionPhotoPath", null);
        }

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
            var card = Cards.findOne({_id: currentCardId});
            if(card != null && card.descriptionPhoto != null) {
                S3.delete(card.descriptionPhotoPath, function(e, r){});
            }
            Cards.remove(currentCardId);
            Router.go('cardsList', {_id: currentDeckId});
    } },

    "click button.upload": function(){
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

                var $image = $('#description_image'),
                    cropBoxData,
                    canvasData,
                    $cropBtn = $('.crop-image'),
                    formData = new FormData(), croppedCanvas = $().cropper('getCroppedCanvas');

                $image.attr('src', r.secure_url);
                $('#image_crop').css('visibility', 'visible');
                $image.cropper({
                    aspectRatio: 1,
                    autoCropArea: 0.80,
                    crop: function (data) {
                        cropImgData = data; // save returned data to cropImgData.
                        console.log(cropImgData);   //cropImgData is the returned data from cropper
                    },
                    built: function () {
                        // Strict mode: set crop box data first
                        $image.cropper('setCropBoxData', cropBoxData);
                        $image.cropper('setCanvasData', canvasData);
                        $cropBtn.on('click', function () {
                            var tmp = $image.cropper('getCroppedCanvas');
                            var file = tmp.toDataURL("image/png");
                            var fileBlob = dataURLtoBlob(file);

                            S3.upload({
                                files:[fileBlob],
                                path:"cardDefiniton"

                            }, function(e,r) {
                                if(e == null) {
                                    Session.set(cardId + "descriptionPhotoPath", r.relative_url);
                                    Session.set(cardId + "descriptionPhoto", r.secure_url);
                                    Session.set(cardId + 'finishUpload', true);
                                    $image.cropper('destroy');
                                }
                            });
                        });
                    }
                });
            }
            else{
                alert("Upload has failed");
            }
        });
    },

    "click button.crop": function(){
        $('#description_image').cropper('getCroppedCanvas');
    }


});

Template.s3_tester.helpers({
    "files": function(){
        return S3.collection.find();
    }
});


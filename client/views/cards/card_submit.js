Template.cardsList.events({
    'submit form': function(e) {
        e.preventDefault();
        var currentDeckId = Session.get('currentDeckId');
        var cardId = "cardIn"+currentDeckId;
        var card = {
            title: $(e.target).find('[name=title]').val(),
            keyword: $(e.target).find('[name=keyword]').val(),
            definition: $(e.target).find('[name=definition]').val(),
            descriptionPhoto: Session.get(cardId + "descriptionPhoto"),
            descriptionPhotoPath: Session.get(cardId + "descriptionPhotoPath"),
            deckId: currentDeckId,
            type: "personalCard"
        };

        Session.set(cardId + "descriptionPhoto", null);
        Session.set(cardId + "descriptionPhotoPath", null);

        //clear input fields
        $(e.target).find('[name=title]').val('');
        $(e.target).find('[name=keyword]').val('');
        $(e.target).find('[name=definition]').val('');

        Meteor.call('postCard', card, function (error, id) {
            if (error){
                throwError(error.reason);
                if(error.error === 302) {
                    //Router.go('postPage', {_id: error.details}, {});
                }
            } else {
                $('#description_image').attr('src', '');
                Router.go('cardsList', {_id: currentDeckId});
            }
        });
    },

    "click button.upload": function(){
        var file = $("input.file_bag")[0].files[0];
        if(file.size > 5000000)
        {
            sAlert.warning("The image is too big.");
            return;
        }

        S3.upload({
            files:[file],
            path:"tmp"
        },function(e,r){
            if(e == null) {
                var deckId = Session.get('currentDeckId');
                var cardId = "cardIn"+deckId;
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
                                    $image.attr('src', r.secure_url);
                                }
                            });
                        });
                    }
                });
            }
            else{
                sAlert.warning("Upload has failed");
            }
        });
    },

    "click button.crop": function(){
        $('#description_image').cropper('getCroppedCanvas');
    }

});
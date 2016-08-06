Template.selectPlan.helpers({
    plans: function(){
        var getPlans = Meteor.settings.public.plans;
        if (getPlans) {
            return getPlans;
        }
    }
});

Template.selectPlan.rendered = function(){
    var firstPlanItem = $('.select-plan a:first-child');
    firstPlanItem.addClass('active');
    firstPlanItem.find('input').prop("checked", true);
};

Template.selectPlan.events({
    'click .list-group-item': function(e){
        var parent = $(e.target).closest('.list-group-item');
        parent.addClass("active");
        $('.list-group-item').not(parent).removeClass("active");
        parent.find('input[type="radio"]').prop("checked", true);
    },

    'submit form': function(e) {
        e.preventDefault();

        var selectedPlan = $('.list-group-item.active input').val();
        Session.set("selectedPlan", selectedPlan);

        STRIPE.getToken( '#select-plan', {
            number: $('[data-stripe="cardNumber"]').val(),
            exp_month: $('[data-stripe="expMo"]').val(),
            exp_year: $('[data-stripe="expYr"]').val(),
            cvc: $('[data-stripe="cvc"]').val()
        }, function() {

            var submitButton = $('input[type="submit"]').button('loading');

            var customer = Meteor.user();

            var stripeCustomer = {
                name: customer.username,
                emailAddress: "test@gmail.com",
                plan: $('[name="selectPlan"]:checked').val(),
                token: $('[name="stripeToken"]').val()
            };

            Meteor.call('createTrialCustomer', stripeCustomer, function(error, response){
                if (error) {
                    alert(error.reason);
                    submitButton.button('reset');
                } else {
                    if ( response.error ) {
                        alert(response.message);
                        submitButton.button('reset');
                    } else {
                        submitButton.button('reset');
                        sAlert.success("You have become premium member");
                        //Meteor.loginWithPassword(customer.emailAddress, customer.password, function(error){
                        //    if (error) {
                        //        alert(error.reason);
                        //        submitButton.button('reset');
                        //    } else {
                        //        Router.go('/lists');
                        //        sAlert.success("You have become premium member");
                        //        submitButton.button('reset');
                        //    }
                        //});
                    }
                }
            });
        });

        //Router.go('creditCard');
    }

});


//TODO: plan choose handler here


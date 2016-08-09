Template.billingResubscribe.events({
    'submit form': function(e){
        e.preventDefault();

        var selectedPlan        = $('[name="selectPlan"]:checked').val(),
            addingNewCreditCard = Session.get('addingNewCreditCard'),
            resubscribeButton   = $(".resubscribe").button('loading');

        var updateSubscription = function(plan){
            Meteor.call("stripeUpdateSubscription", plan, function(error, response){
                if (error){
                    resubscribeButton.button("reset");
                    Bert.alert(error.message, "danger");
                } else {
                    resubscribeButton.button("reset");
                    Bert.alert("Successfully resubscribed. Welcome back!", "success");
                    Router.go('/billing');
                }
            });
        }

        if (addingNewCreditCard){
            STRIPE.getToken( '#resubscribe', {
                number: $('[data-stripe="cardNumber"]').val(),
                exp_month: $('[data-stripe="expMo"]').val(),
                exp_year: $('[data-stripe="expYr"]').val(),
                cvc: $('[data-stripe="cvc"]').val()
            }, function() {
                var token = $( "#resubscribe [name='stripeToken']" ).val();

                Meteor.call("stripeSwapCard", token, function(error, response){
                    if (error){
                        resubscribeButton.button("reset");
                        Bert.alert(error.message, "danger");
                    } else {
                        updateSubscription(selectedPlan);
                    }
                });
            });
        } else {
            updateSubscription(selectedPlan);
        }
    }
});
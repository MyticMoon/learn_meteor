var Future = Npm.require('fibers/future');

var secret = Meteor.settings.private.stripe.testSecretKey;
var Stripe = StripeAPI(secret);

Meteor.methods({
    createTrialCustomer: function(customer){
        check(customer, {
            name: String,
            emailAddress: String,
            //password: String,
            plan: String,
            token: String
        });

        var emailRegex     = new RegExp(customer.emailAddress, "i");
        //var lookupCustomer = Meteor.users.findOne({"emails.address": emailRegex});

        var lookupCustomer = Meteor.user();

        //TODO: need to check for existing Stripe customer here
        if ( lookupCustomer ) {
            var newCustomer = new Future();

            Meteor.call('stripeCreateCustomer', customer.token, customer.emailAddress, function(error, stripeCustomer){
                if (error) {
                    console.log(error);
                } else {

                    console.log(stripeCustomer);

                    var customerId = stripeCustomer.id,
                        plan       = customer.plan;

                    Meteor.call('stripeCreateSubscription', customerId, plan, function(error, response){
                        if (error) {
                            console.log(error);
                        } else {
                            try {
                                var user = Meteor.user();

                                var subscription = {
                                    customerId: customerId,
                                    subscription: {
                                        plan: {
                                            name: customer.plan,
                                            used: 0
                                        },
                                        payment: {
                                            card: {
                                                type: stripeCustomer.sources.data[0].brand,
                                                lastFour: stripeCustomer.sources.data[0].last4
                                            },
                                            nextPaymentDue: response.current_period_end
                                        }
                                    }
                                };

                                Meteor.users.update(user, {
                                    $set: subscription
                                }, function(error, response){
                                    if (error){

                                        console.log(error);
                                    } else {
                                        newCustomer.return(user);
                                    }
                                });
                            } catch(exception) {
                                newCustomer.return(exception);
                            }
                        }
                    });
                }
            });
            return newCustomer.wait();
        }
    },

    stripeCreateSubscription: function(customer, plan) {
        var stripeSubscription = new Future();

        Stripe.customers.createSubscription(customer, {plan: plan}, function(error, subscription) {
            if(error) {
                stripeSubscription.return(error);
            }
            else{
                stripeSubscription.return(subscription);
            }
        });

        return stripeSubscription.wait();
    },

    stripeCreateCustomer: function(token, email){
        // Note: we'd check() both of our arguments here, but I've stripped this out for the sake of brevity.

        console.log("Going to call stripe customer create");
        var stripeCustomer = new Future();

        Stripe.customers.create({
            source: token,
            email: email
        }, function(error, customer){
            if (error){
                stripeCustomer.return(error);
            } else {
                stripeCustomer.return(customer);
            }
        });
        return stripeCustomer.wait();
    }
});


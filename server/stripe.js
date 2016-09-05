var Future = Npm.require('fibers/future');
var Fiber  = Npm.require('fibers');
var secret = Meteor.settings.private.stripe.testSecretKey;
var Stripe = StripeAPI(secret);

SERVER_AUTH_TOKEN = Random.secret();


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
                                            premiumDeckUsed: 0,
                                            freeDeckUsed: 0
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
    },

    stripeUpdateSubscription: function(plan){
        check(plan, String);

        var stripeUpdateSubscription = new Future();

        var user    = Meteor.userId();
        var getUser = Meteor.users.findOne({"_id": user}, {fields: {"customerId": 1}});

        Stripe.customers.updateSubscription(getUser.customerId, {
            plan: plan
        }, function(error, subscription){
            if (error) {
                stripeUpdateSubscription.return(error);
            } else {
                Fiber(function(){
                    var update = {
                        auth: SERVER_AUTH_TOKEN,
                        user: user,
                        plan: plan,
                        status: subscription.status,
                        date: subscription.current_period_end
                    };
                    Meteor.call('updateUserPlan', update, function(error, response){
                        if (error){
                            stripeUpdateSubscription.return(error);
                        } else {
                            stripeUpdateSubscription.return(response);
                        }
                    });
                }).run();
            }
        });

        return stripeUpdateSubscription.wait();
    },

    stripeSwapCard: function(token){
        // Check our arguments against their expected patterns.
        check(token, String);

        // Because Stripe's API is asynchronous (meaning it doesn't block our function
        // from running once it's started), we need to make use of the Fibers/Future
        // library. This allows us to create a return object that "waits" for us to
        // return a value to it.
        var stripeSwapCard = new Future();

        // Before we jump into everything, we need to get our customer's ID. Recall
        // that we can't send this over from the client because we're *not* publishing
        // it to the client. Instead, here, we take the current userId from Meteor
        // and lookup our customerId.
        var user    = Meteor.userId();
        var getUser = Meteor.users.findOne({"_id": user}, {fields: {"customerId": 1}});

        // If all is well, call to the Stripe API to create our new card on our customer!
        // Note: our stripeCreateCard method is not the same as creating a token. The difference
        // here is that this creates a card _on our customer_ not the card token itself. To
        // get our token, we'd call to our stripeCreateToken method (defined as an example above).

        console.log(getUser.customerId);

        console.log(token);

        Stripe.customers.update(getUser.customerId, {
            source: token
        }, function(error, customer){
            if (error) {
                console.log(error);
                stripeSwapCard.return(error);
            } else {
                var card = {
                    lastFour: customer.sources.data[0].last4,
                    type: customer.sources.data[0].brand
                };
                // Because we're running Meteor code inside of an async callback, we need to wrap
                // it in a Fiber. Note: this is a verbose way of doing this. You could refactor this
                // and the call to Stripe to use a Meteor.wrapAsync method instead. The difference is
                // that while wrapAsync is cleaner syntax-wise, it can be a bit confusing.
                Fiber(function(){
                    var update = {
                        auth: SERVER_AUTH_TOKEN,
                        user: user,
                        card: card
                    };
                    // And then we pass our update over to our updateUserPlan method.

                    console.log(update.auth + " == " + SERVER_AUTH_TOKEN);

                    Meteor.call('updateUserCard', update, function(error, response){
                        if (error){
                            stripeSwapCard.return(error);
                        } else {
                            stripeSwapCard.return(response);
                        }
                    });
                }).run();
            }
        });

        return stripeSwapCard.wait();
    },

    stripeUpdateCard: function(updates){
        // Check our arguments against their expected patterns. This is especially
        // important here because we're dealing with sensitive customer information.
        check(updates, {
            exp_month: String,
            exp_year: String
        });

        // Because Stripe's API is asynchronous (meaning it doesn't block our function
        // from running once it's started), we need to make use of the Fibers/Future
        // library. This allows us to create a return object that "waits" for us to
        // return a value to it.
        var stripeUpdateCard = new Future();

        // Before we jump into everything, we need to get our customer's ID. Recall
        // that we can't send this over from the client because we're *not* publishing
        // it to the client. Instead, here, we take the current userId from Meteor
        // and lookup our customerId.
        var user    = Meteor.userId();
        var getUser = Meteor.users.findOne({"_id": user}, {fields: {"customerId": 1}});

        // Because we're not storing our user's card ID, we need to call Stripe first to
        // retrieve that information before we perform the update. This is key, because
        // without it, Stripe won't know which card to update. Once we have this info,
        // we call to Stripe *again* to update our customer's profile.
        Meteor.call('stripeRetrieveCustomer', getUser.customerId, function(error, response){
            if (error){
                stripeUpdateCard.return(error);
            } else {
                var card = response.sources.data[0].id;
                // If all is well, call to the Stripe API to update our card!
                Stripe.customers.updateCard(getUser.customerId, card, updates, function(error, customer){
                    if (error) {
                        stripeUpdateCard.return(error);
                    } else {
                        stripeUpdateCard.return(customer);
                    }
                });
            }
        });

        return stripeUpdateCard.wait();
    },

    stripeCancelSubscription: function(){
        // Because Stripe's API is asynchronous (meaning it doesn't block our function
        // from running once it's started), we need to make use of the Fibers/Future
        // library. This allows us to create a return object that "waits" for us to
        // return a value to it.
        var stripeCancelSubscription = new Future();

        // Before we jump into everything, we need to get our customer's ID. Recall
        // that we can't send this over from the client because we're *not* publishing
        // it to the client. Instead, here, we take the current userId from Meteor
        // and lookup our customerId.
        var user    = Meteor.userId();
        var getUser = Meteor.users.findOne({"_id": user}, {fields: {"customerId": 1}});

        // Once we have our customerId, call to Stripe to cancel the active subscription.
        Stripe.customers.cancelSubscription(getUser.customerId, {
            at_period_end: true
        }, function(error, response){
            if (error) {
                stripeCancelSubscription.return(error);
            } else {
                // Because we're running Meteor code inside of another function's callback, we need to wrap
                // it in a Fiber. Note: this is a verbose way of doing this. You could refactor this
                // and the call to Stripe to use a Meteor.wrapAsync method instead. The difference is
                // that while wrapAsync is cleaner syntax-wise, it can be a bit confusing. To keep
                // things simple, we'll stick with a Fiber here.
                Fiber(function(){
                    var update = {
                        auth: SERVER_AUTH_TOKEN,
                        user: user,
                        subscription: {
                            status: response.cancel_at_period_end ? "canceled" : response.status,
                            ends: response.current_period_end
                        }
                    };
                    Meteor.call('updateUserSubscription', update, function(error, response){
                        if (error){
                            stripeCancelSubscription.return(error);
                        } else {
                            stripeCancelSubscription.return(response);
                        }
                    });
                }).run();
            }
        });

        return stripeCancelSubscription.wait();
    }

});


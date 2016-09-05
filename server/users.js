var Future = Npm.require('fibers/future');

Meteor.methods({

    updateUserPlan: function(update){
        // Check our update argument against our expected pattern.
        check(update, {
            auth: String,
            user: String,
            plan: String,
            status: String,
            date: Number
        });

        // Before we perform the update, ensure that the auth token passed is valid.
        if ( update.auth == SERVER_AUTH_TOKEN ){
            // If arguments are valid, continue with updating the user.
            Meteor.users.update(update.user, {
                $set: {
                    "subscription.plan.name": update.plan,
                    "subscription.ends": update.date,
                    "subscription.payment.nextPaymentDue": update.date,
                    "subscription.status": update.status
                }
            }, function(error){
                if (error) {
                    console.log(error);
                }
            });
        } else {
            throw new Meteor.Error('invalid-auth-token', 'Sorry, your server authentication token is invalid.');
        }
    },

    checkUserPlan: function(user) {
        check(user, String);

        var getUser = Meteor.users.findOne({"_id": user}, {fields: {"subscription": 1}}),
            subscription = getUser.subscription;

        var availablePlans = Meteor.settings.public.plans;
        var currentPlan = _.find(availablePlans, function(plan) {
            return plan.name == subscription.plan.name;
        });
        var freeDeckLimit = currentPlan.freeDeckLimit;
        var premiumDeckLimit = currentPlan.premiumDeckLimit;
        var amount = currentPlan.amount.usd;

        if(subscription && freeDeckLimit && premiumDeckLimit) {
            var planData = {
                subscription: subscription,
                freeDeckLimit: freeDeckLimit,
                premiumDeckLimit: premiumDeckLimit,
                amount: amount
            };
            return planData;
        }
        else{
            return false;
        }
    },

    updateUserCard: function(update){
        console.log("it goes in here");
        // Check our update argument against our expected pattern.
        check(update, {auth: String, user: String, card: {lastFour: String, type: String}});

        var updateUserCardFuture = new Future();

        console.log("it goes in here too");
        // Before we perform the update, ensure that the auth token passed is valid.
        if ( update.auth == SERVER_AUTH_TOKEN ){
            // If arguments are valid, continue with updating the user.
            Meteor.users.update(update.user, {
                $set: {
                    "subscription.payment.card": update.card
                }
            }, function(error, response){
                if (error) {
                    updateUserCardFuture.return(error);
                } else {
                    updateUserCardFuture.return(response);
                }
            });
        } else {
            throw new Meteor.Error('invalid-auth-token', 'Sorry, your server authentication token is invalid.');
        }

        return updateUserCardFuture.wait();
    },

    updateUserSubscription: function(update){
        // Check our update argument against our expected pattern.
        check(update, {auth: String, user: String, subscription: {status: String, ends: Number}});

        // Here, we need to create a new Future because we'll be returning this information back to
        // our Stripe method. Note, we're mostly doing this because we're "blocking" the return of our
        // update method below in order to check the security of our method call. Certainly a trade-off,
        // but considering it nets us an extra touch of security, not that bad.
        var updateUserSubscription = new Future();

        // Before we perform the update, ensure that the auth token passed is valid.
        if ( update.auth == SERVER_AUTH_TOKEN ){
            // If arguments are valid, continue with updating the user.
            Meteor.users.update(update.user, {
                $set: {
                    "subscription.status": update.subscription.status,
                    "subscription.ends": update.subscription.ends,
                    "subscription.payment.nextPaymentDue": update.subscription.ends
                }
            }, function(error, response){
                if (error) {
                    updateUserSubscription.return(error);
                } else {
                    updateUserSubscription.return(response);
                }
            });
        } else {
            throw new Meteor.Error('invalid-auth-token', 'Sorry, your server authentication token is invalid.');
        }

        return updateUserSubscription.wait();
    }

});
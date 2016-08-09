var Future = Npm.require('fibers/future');


Meteor.methods({
    checkUserFreeDeckQuota: function(user, freeOrPremium) {
        check(user, String);

        var getUser  = Meteor.users.findOne({"_id": user}, {fields: {"subscription.plan": 1}}),
            plan = getUser.subscription.plan,
            planName = plan.name,
            premiumDeckUsed = plan.premiumDeckUsed,
            freeDeckUsed = plan.freeDeckUsed;

        var availablePlans = Meteor.settings.public.plans;
        var currentPlan = _.find(availablePlans, function(plan) { return plan.name == planName });
        var freeDeckLimit = currentPlan.freeDeckLimit;
        var premiumDeckLimit = currentPlan.premiumDeckLimit;

        if(freeOrPremium == "free") {
            return freeDeckUsed < freeDeckLimit;
        }
        else {
            return premiumDeckUsed < premiumDeckLimit;
        }
    },

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
    }
});
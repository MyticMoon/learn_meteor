Template.billingPlan.helpers({
    plans: function(){
        var getPlans = Meteor.settings.public.plans;
        if (getPlans) {
            return getPlans;
        }
    },

    upgradeAvailable: function(iteratedPlanAmount) {
        var currentUser = Meteor.userId();
        var getPlan = Session.get('getUserPlan_' + currentUser);

        Meteor.call('checkUserPlan', currentUser, function(error, response){
            if(error){
                sAlert.error(error);
            }
            else{
                Session.set('getUserPlan_' + currentUser, response);
            }
        });

        if(getPlan) {
            var currentPlanAmount = parseInt( getPlan.amount.replace("$", "") ) * 100;
            return currentPlanAmount < iteratedPlanAmount;
        }
    },

    downgradeAvailable: function(freeDeckLimit, premiumDeckLimit) {
        var currentUser = Meteor.userId();
        var getPlan = Session.get('getUserPlan_' + currentUser);
        if(getPlan) {
            var premiumDeckUsed = getPlan.subscription.plan.premiumDeckUsed;
            var freeDeckUsed = getPlan.subscription.plan.freeDeckUsed;

            return (premiumDeckUsed <= premiumDeckLimit) && (freeDeckUsed <= freeDeckLimit);
        }
    }
});

Template.billingPlan.events({
    'click .downgrade-upgrade': function(e) {
        var plan = this.name;
        var downgradeUpgradeButton = $(e.target).button('loading');
        var confirmPlanChange = confirm("Are you sure you want to change plan");
        if(confirmPlanChange){
            Meteor.call('stripeUpdateSubscription', plan, function(error, response){
                if (error){
                    downgradeUpgradeButton.button('reset');
                    sAlert.warning(error.reason);
                } else {
                    if (response && response.error){
                        sAlert.warning(response.error.message);
                    } else {
                        downgradeUpgradeButton.button('reset');
                        Session.set('currentUserPlan_' + Meteor.userId(), null);
                        sAlert.success("Subscription successfully updated!");
                    }
                }
            });
        }
        else{
            downgradeUpgradeButton.button('reset');
        }
    }
});
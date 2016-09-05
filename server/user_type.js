/*
    Add userType upon user creation
    Trying to create free Stripe subscription here
 */
var Future = Npm.require('fibers/future');

Accounts.onCreateUser(function(options, user){
    user.userType = 'freeUser';
    user.profile = user.profile || {};


    // Start here
    // TODO: fix user's email address here
    var customer = {
        name: user.userName,
        emailAddress: 'test@gmail.com',
        plan: 'free',
        token: {}
    };

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

                        console.log(response);

                        user.customerId = customerId;
                        user.subscription = {
                            plan: {
                                name: customer.plan,
                                premiumDeckUsed: 0,
                                freeDeckUsed: 0
                            },
                            payment: {
                                card: {
                                    type: '',
                                    lastFour: ''
                                },
                                nextPaymentDue: ''
                            }
                        };

                        console.log("After subscription");
                        console.log(user);
                        newCustomer.return(user);
                    } catch(exception) {
                        console.log(exception);
                        newCustomer.return(exception);
                        return user;
                    }
                }
            });
        }
    });
    return newCustomer.wait();
});
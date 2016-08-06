UI.registerHelper('capitalize', function(string){
    if (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});


UI.registerHelper('limitString', function(limit){
    return limit > 1 ? limit + " lists" : limit + " list";
});

/*
 * Plan
 * Get the current subscription data for our user. We set this up as a UI helper
 * because we'll need to reference this information more than once.
 */

UI.registerHelper('plan', function(){
    // Get the current user.
    var user = Meteor.userId(),
        plan = Session.get('currentUserPlan_' + user);
    // If we have a user, call to checkUserPlan on the server to determine
    // their current plan. We do this so that we don't have to publish the user's
    // subscription data to the client.
    if ( user ) {
        Meteor.call('checkUserPlan', user, function(error, response){
            if (error) {
                alert(error.reason);
            } else {
                // Get the response from the server and set it equal to the user's
                // unique session variable (this will be either true or false).
                Session.set('currentUserPlan_' + user, response);
            }
        });
    }
    // Return the result of the method being called.
    return plan;
});
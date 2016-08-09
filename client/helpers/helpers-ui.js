UI.registerHelper('capitalize', function(string){
    if (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});


UI.registerHelper('limitString', function(limit){
    return limit > 1 ? limit + " decks" : limit + " deck";
});

UI.registerHelper('percentage', function(v1,v2){
    return ( parseInt(v1) / parseInt(v2) ) * 100 + "%";
});

/*
 * Epoch to String
 * Convert a UNIX epoch string to human readable time.
 */

UI.registerHelper('epochToString', function(timestamp){
    if (timestamp){
        var length = timestamp.toString().length;
        if ( length == 10 ) {
            return moment.unix(timestamp).format("MMMM Do, YYYY");
        } else {
            return moment.unix(timestamp / 1000).format("MMMM Do, YYYY");
        }
    }
});

/*
 * Cents to Dollars
 * Take the passed value in cents and convert it to USD.
 */

UI.registerHelper('centsToDollars', function(cents){
    return "$" + cents / 100;
});

/*
 * If Equals
 * Take the two passed values and compare them, returning true if they're equal
 * and false if they're not.
 */

UI.registerHelper('equals', function(c1,c2){
    // If case1 is equal to case2, return true, else false.
    return c1 == c2 ? true : false;
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
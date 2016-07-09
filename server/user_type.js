Accounts.onCreateUser(function(options, user){
    user.userType = 'freeUser';
    user.profile = user.profile || {};
    return user;
});
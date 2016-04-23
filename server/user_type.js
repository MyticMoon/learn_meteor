Accounts.onCreateUser((options, user) => {
    user.userType = 'freeUser';
    return user;
});
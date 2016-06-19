ownsDocument = function(userId, doc) {
    return doc && (doc.authorId === userId || doc.userId === userId);
};

getUserRight = function(userType) {
    var user = Meteor.user();

    if(!user)
        throw new Meteor.Error(401, "You need to login to get user rights");

    switch(userType){
        case "freeUser":
            return freeUserRight;
            break;
        case "premiumUser":
            return premiumUserRight;
            break;
        case "admin":
            return adminRight;
            break;
        default:
            return {
                buyDeckFromMarket: false,
                postDeckToMarket: false,
                requireApproval: true,
                approveDeck: false,
                numberOfDeckToMarket: 0,
                numberOfDeckFromMarket: 0
            };
    }
};

freeUserRight = {
    buyDeckFromMarket: true,
    postDeckToMarket: true,
    requireApproval: false,
    approveDeck: false,
    numberOfDeckToMarket: 5,
    numberOfDeckFromMarket: 5
};

premiumUserRight = {
    buyDeckFromMarket: true,
    postDeckToMarket: true,
    requireApproval: false,
    approveDeck: false,
    numberOfDeckToMarket: 10,
    numberOfDeckFromMarket: 10
};

adminRight = {
    buyDeckFromMarket: true,
    postDeckToMarket: true,
    requireApproval: false,
    approveDeck: true,
    numberOfDeckToMarket: Number.MAX_VALUE,
    numberOfDeckFromMarket: Number.MAX_VALUE
};
views = {};

// client & server
//views.latestPosts = function (terms) {
//    return {
//        find: {},
//        sort: {sort: {createdAt: -1}, limit: terms.limit}
//    };
//};
//
//views.mostPopularPosts = function (terms) {
//    return {
//        find: {},
//        sort: {sort: {score: -1}, limit: terms.limit}
//    };
//};

views.cardsInDeck = function(terms) {
    if(terms.textQuery) {
        return {
            find: {deckId: terms.deckId, $text : {$search: terms.textQuery}},
            options: {sort: {submitted: -1}, limit: terms.limit}
        };
    }
    else {
        return {
            find: {deckId: terms.deckId},
            options: {sort: {submitted: -1}, limit: terms.limit}
        };
    }
};

views.decksInMarket = function(terms) {
    if(terms.textQuery) {
        return {
            find: {type: "marketDeck", $text : {$search: terms.textQuery}},
            options: {sort: {submitted: -1}, limit: terms.limit}
        };
    }
    else {
        return {
            find: {type: "marketDeck"},
            options: {sort: {submitted: -1}, limit: terms.limit}
        };
    }
};

queryConstructor = function (terms) {
    var viewFunction = views[terms.viewName];
    return viewFunction(terms);
};
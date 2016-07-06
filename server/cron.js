var world = function () {
    console.log('World!');
};

var decayMemoryPoint = function() {
    console.log("decay");
    var cards = Cards.find().fetch();

    cards.forEach(function(card){
        var memoryPoint = card.memoryPoint;

        //Decay memoryPoint by 5 each time, ignore if memoryPoint <= 10
        var newMemoryPoint = memoryPoint - 5;
        if(newMemoryPoint < 10) newMemoryPoint = 10;

        if(newMemoryPoint != memoryPoint){
            var memoryPointHistory = card.memoryPointHistory;
            memoryPointHistory.push({dateTime: new Date().getTime(), memoryPoint: newMemoryPoint});
            Cards.update(card._id, {$set: {memoryPoint: newMemoryPoint, memoryPointHistory: memoryPointHistory}}, function(error) {
            });
        }
    });
};

var myBirthDay = function () {
    console.log('My Birth Day!');
};

var cron = new Meteor.Cron( {
    events:{
        "* * * * *"  : world,
        "* * * * *"  : decayMemoryPoint,
        "0 0 18 6 *" : myBirthDay
    }
});
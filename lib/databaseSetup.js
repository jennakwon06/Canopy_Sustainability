Filters = new Mongo.Collection("userFilters");
Results = new Mongo.Collection("userResults");
PDFs = new Mongo.Collection("fs.files");

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('userFilters', function userFilterPublication() {
        return Filters.find();
    });

    Meteor.publish('userResults', function userResultPublication() {
        return Results.find();
    });

    Meteor.publish('fs.files', function pdfsPublication() {
        return PDFs.find();
    });
}


//PDFs = new FS.Collection("fs.files", {
//    stores: [new FS.Store.FileSystem("fsfiles", {path: "./reports"})]
//});


//PDFs.allow({
//    insert: function(userId, doc) {
//        return true;
//    }
//});

Filters.allow({
    insert: function(userId, doc) {
        return true;
    }
});

Results.allow({
    insert: function(userId, doc) {
        return true;
    }
});

Meteor.methods({
   saveResults: function(resultsArray, userId, date) {
       Results.insert({
           results: resultsArray,
           createdBy: userId,
           createdAt: date
       });
       console.log(Results.find({}).count());
   }
});


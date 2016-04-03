Filters = new Mongo.Collection("userFilters");
Results = new Mongo.Collection("userResults");

PDFs = new FS.Collection("fs.files", {
    stores: [new FS.Store.FileSystem("fsfiles", {path: "./reports"})]
});


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


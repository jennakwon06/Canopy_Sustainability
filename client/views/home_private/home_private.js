Filters = new Mongo.Collection("userFilters");
Results = new Mongo.Collection("userResults");


Template.HomePrivate.rendered = function() {
    //$.getScript("/d3.js");
    //$.getScript("/crossfilter.js");
    //$.getScript("/dc.js");
    //$.getScript("/colorbrewer.js");

    $.getScript("/filters.js");
};

Template.HomePrivate.events({
    'click #applyFilterButton': function (e) {
        e.preventDefault();
        var results = globalFilter.top(Infinity);
        var table = $(".resultTable");

        //clear table
        $('.resultTable > tbody').empty();

        Filters.insert({
            //insert filters? and the result companies?
        });

        for (var i = results.length - 1; i >= 0; i--) {
            var tr = document.createElement('tr');

            var td1 = document.createElement('td');
            var td2 = document.createElement('td');
            var td3 = document.createElement('td');
            var td4 = document.createElement('td');

            td1.appendChild(document.createTextNode(results[i].Name));
            td2.appendChild(document.createTextNode(results[i].industry));
            td3.appendChild(document.createTextNode(results[i].sector));
            td4.appendChild(document.createTextNode(results[i].country));

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);

            table.append(tr);
        }
    },

    'click #saveResultButton': function (e) {
        e.preventDefault();

        Results.insert({
            //@TODO insert to Mongo database
        });
    }

});

Template.HomePrivate.helpers({

});

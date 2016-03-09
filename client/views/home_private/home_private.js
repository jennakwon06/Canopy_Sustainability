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
        var table = $(".resultsTable");

        //clear table
        $('.resultsTable > tbody').empty();

        Filters.insert({
            //insert filters? and the result companies?
        });

        for (var i = results.length - 1; i >= 0; i--) {
            var tr = document.createElement('tr');

            tr.className += "clickableRow";
            tr.id += results[i].Name;
            tr.setAttribute("data-toggle", "modal");
            tr.setAttribute("data-target", "#myModal");

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
            //tr.data(results[i]);

            table.append(tr);
        }

        //enable button
        $('#saveResultButton').removeAttr("disabled");
    },

    'click #saveResultButton': function (e) {
        e.preventDefault();

        var resultsArr = [];

        $(".clickableRow").each(function (i) {
            resultsArr.push(this.id);
        });

        console.log("inserting!");
        Meteor.call('saveResults', resultsArr, Meteor.userId(), new Date());
    },

    // highlight table row clicked
    'click .clickableRow': function (e) {
        var name = $(e.currentTarget).attr('id');
        $(e.currentTarget).addClass('highlight');
        $(e.currentTarget).siblings().removeClass('highlight');

        d3.csv("/data/envDataOnSP500.csv", function(error, data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].Name == name) {
                    $(".modal-body").text(data[i].Name);
                }
            }
        });
    }

});

Template.HomePrivate.helpers({

});

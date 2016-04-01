Template.HomePrivate.rendered = function() {
    //$.getScript("/d3.js");
    //$.getScript("/crossfilter.js");
    //$.getScript("/dc.js");
    //$.getScript("/colorbrewer.js");

    $.getScript("/filters.js");
    $.getScript("/worldmap.js");
    $.getScript("/scatterplot.js");

};

var i = 0;

Template.HomePrivate.events({
    // Reset all on buttons with
    'click #resetEmissions' : function (e) {
        ghg1Chart.filterAll();
        ghg2Chart.filterAll();
        ghg3Chart.filterAll();
    },

    'click #collapseFilterButton': function(e) {
        if (i % 2 == 0) {
            $('#controlBar').animate({
                left: "0px"
            }, 500, function() {});

            $('#filterBar').animate({
                opacity: 0
            }, 500, function() {});

            $('#resultBar').css({"width" : "96vw","position" :"fixed"});

            $(".glyphicon-arrow-left").addClass( "glyphicon-arrow-right");
            $(".glyphicon-arrow-right").removeClass( "glyphicon-arrow-left");

        } else {
            $(".glyphicon-arrow-right").addClass( "glyphicon-arrow-left");
            $(".glyphicon-arrow-left").removeClass( "glyphicon-arrow-right");

            $('#resultBar').removeAttr("style");
            $('#controlBar').removeAttr("style");

            $('#filterBar').animate({
                opacity: 1
            }, 500, function() {

            });
            //$('#controlBar').animate({
            //    left: "50px"
            //}, 5000, function() {
            //
            //});
            //
            //$('#filterBar').animate({
            //    display: "none"
            //}, 5000, function() {
            //
            //});
        }
        i++;
    },

    'click rect': function (e) {
        $('.companiesCount').html(globalFilter.top(Infinity).length);

    },

    'click #resetAllFiltersButton': function(e) {
        dc.redrawAll();
        dc.filterAll();
    },

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
        $('#saveResultButton').removeClass("disabled");
        $('#resultListViewButton').removeClass("disabled");
        $('#resultMapViewButton').removeClass("disabled");
        $('#resultScatterPlotViewButton').removeClass("disabled");


        drawBubblesOnMap(results);
        drawBubblesOnScatterPlot(results);
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

                    d3.select(".list-group")
                        .append("li")
                        .attr("class", "modal-list-item list-group-item")
                        .attr("value", d)
                        .attr("id", d)
                        .text(data[i].GR_name);
                }
            }
        });
    },

    'click #closeModalButton': function (e) {
        $('tbody > .clickableRow').removeClass('highlight');
    },

    'click #resultListViewButton': function (e) {
        $('.resultListView').attr("style", "display: block");
        $('.resultMapView').attr("style", "display: none");
        $('.resultScatterPlotView').attr("style", "display: none");

    },

    'click #resultMapViewButton': function (e) {
        $('.resultListView').attr("style", "display: none");
        $('.resultMapView').attr("style", "display: block");
        $('.resultScatterPlotView').attr("style", "display: none");

    },


    'click #resultScatterPlotViewButton': function (e) {
        $('.resultListView').attr("style", "display: none");
        $('.resultMapView').attr("style", "display: none");
        $('.resultScatterPlotView').attr("style", "display: block");

    }
});

Template.HomePrivate.helpers({

});

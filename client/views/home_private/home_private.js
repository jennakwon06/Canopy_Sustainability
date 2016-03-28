Template.HomePrivate.rendered = function() {
    //$.getScript("/d3.js");
    //$.getScript("/crossfilter.js");
    //$.getScript("/dc.js");
    //$.getScript("/colorbrewer.js");

    $.getScript("/filters.js");
};

var i = 0;

Template.HomePrivate.events({
    // Reset all on buttons with
    'click #resetEmissions' : function (e) {
        ghg1Chart.filterAll();
        ghg2Chart.filterAll();
        ghg3Chart.filterAll();
    },

    //'click #resetEmissions' : function (e) {
    //
    //},

    //'click #resetEmissions' : function (e) {
    //
    //},



    //'click #resetEmissions' : function (e) {
    //
    //},
    //'click #resetEmissions' : function (e) {
    //
    //},



    'click #collapseFilterButton': function(e) {

        //$('#filterBar').toggle(400);
        //
        //if (i % 2 == 0) {
        //    $('#controlBar').css("left", "0px");
        //    $('#resultBar').css("width", "96vw");
        //} else {
        //    $('#resultBar').css("width", "62vw");
        //    $('#controlBar').removeAttr("style");
        //}
        //i++;
        //console.log(i);
        //
        //


        if (i % 2 == 0) {
            $('#controlBar').animate({
                left: "0px"
            }, 20, function() {});

            $('#filterBar').animate({
                opacity: 0
            }, 20, function() {});

            $('#resultBar').css({"width" : "96vw","position" :"fixed"});
            //$('#resultBar').css("position", "fixed");


            //glyphicon-arrow-left

            $(".glyphicon-arrow-left").addClass( "glyphicon-arrow-right");
            $(".glyphicon-arrow-right").removeClass( "glyphicon-arrow-left");


            //    $('#resultBar').css("width", "62vw");

        } else {

            $(".glyphicon-arrow-right").addClass( "glyphicon-arrow-left");
            $(".glyphicon-arrow-left").removeClass( "glyphicon-arrow-right");


            $('#resultBar').removeAttr("style");
            $('#controlBar').removeAttr("style");

            $('#filterBar').animate({
                opacity: 1
            }, 20, function() {

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
        console.log(i);


        //console.log($('#controlBar').getAttribute());
        //
        //$('#filterBar').toggle("slide");
        //$('#controlBar').toggle(
        //    function () {
        //        $("#controlBar").animate({"left": "20px", "display": "inline-block"}, 500);
        //    },
        //    function () {
        //        $("#controlBar").animate({"left": "20px", "display": "inline-block"}, 500);
        //    });
    },


    'click rect': function (e) {
        $('.companiesCount').html(globalFilter.top(Infinity).length);

    },

    'click .glyphicon-remove': function(e) {
        console.log("about to filter everything");
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

Template.Home.rendered = function() {
    Meteor.subscribe('userFilters');
    Meteor.subscribe('userResults');
    Meteor.subscribe('fs.files');

    $.getScript("/gradientBar.js");
    $.getScript("/utility.js");
    $.getScript("/filters.js").done(function(script, textStatus){
        $.getScript("/scatterplot.js");
        $.getScript("/globalFunctions.js");
        $.getScript("/worldMap.js").done(function( script, textStatus ) {
            renderPage();
        });
    });
};

var i = 0;
var iScatter = 0;
var iMap = 0;
var iList = 0;

var findPDFs = function(company) {
    // Check if database is correctly set up
    console.log(PDFs.find().count());
    console.log(PDFs.find({}));
    var regex = new RegExp('^' + company, 'i');
    // @TODO use regex to find a file by name
    return PDFs.find({}).fetch();
};

Template.Home.events({
//<!------ CONTROL BAR ---->
    'click #resetEmissions' : function (e) {
        ghg1Chart.filterAll();
        ghg2Chart.filterAll();
        ghg3Chart.filterAll();
    },

    //// Switch between views
    //'click #resultListViewButton': function (e) {
    //    $('.resultListView').attr("style", "display: block");
    //    $('.resultMapView').attr("style", "display: none");
    //    $('.resultScatterPlotView').attr("style", "display: none");
    //
    //},
    //'click #resultMapViewButton': function (e) {
    //    $('.resultListView').attr("style", "display: none");
    //    $('.resultMapView').attr("style", "display: block");
    //    $('.resultScatterPlotView').attr("style", "display: none");
    //
    //},
    //'click #resultScatterPlotViewButton': function (e) {
    //    $('.resultListView').attr("style", "display: none");
    //    $('.resultMapView').attr("style", "display: none");
    //    $('.resultScatterPlotView').attr("style", "display: block");
    //},
    //
    // Update number counter button
    //'click rect': function (e) {
    //    $('.companiesCount').empty();
    //    $('.companiesCount').html(globalFilter.top(Infinity).length);
    //},

    'click #resetAllFiltersButton': function(e) {
        dc.redrawAll();
        dc.filterAll();
        //$('.companiesCount').html(globalFilter.top(Infinity).length);
    },


    'click #scrollToGeneral': function(e) {
        $('#filterBar').animate({
            scrollTop: $(".panelGeneral").position().top
        }, 500);
    },
    
    'click #scrollToEmissions': function(e) {
        $('#filterBar').animate({
            scrollTop: $(".panelEmissions").position().top
        }, 500);
    },
    

    'click #scrollToWater': function(e) {
        $('#filterBar').animate({
            scrollTop: $(".panelWater").position().top
        }, 500);
    },

    'click #scrollToWaste': function(e) {
        $('#filterBar').animate({
            scrollTop: $(".panelWaste").position().top
        }, 500);
    },

    'click #scrollToEnergy': function(e) {
        $('#filterBar').animate({
            scrollTop: $(".panelEnergy").position().top
        }, 500);
    },

    'click #scrollToMisc': function(e) {
        $('#filterBar').animate({
            scrollTop: $(".panelMisc").position().top 
        }, 500);
    },

    'click #saveResultButton': function (e) {
        e.preventDefault();

        var resultsArr = [];

        $(".clickableRow").each(function (i) {
            resultsArr.push(this.id);
        });

        Meteor.call('saveResults', resultsArr, Meteor.userId(), new Date());
    },

//<!----- LIST VIEW ---->

    'click .clickableRow': function (e) {
        e.preventDefault();

        $(e.currentTarget).addClass('highlight');
        $(e.currentTarget).siblings().removeClass('highlight');

        var $target = $(e.currentTarget);
        if ( $target.closest("td").attr("colspan") > 1 ) {
            $target.slideUp();
        } else {
            $target.closest("tr").next().find("td").slideToggle("fast");
        }

        console.log("from caller");
        console.log($target.attr("name"));
        console.log("caller end");

        linkData($target.attr("name"), $target.attr("address"), false, false, true);
    },

    'click #closeModalButton': function (e) {
        $('.list-group').empty();

        $('tbody > .clickableRow').removeClass('highlight');
    },

// @TODO MAP STUFF
    'click .mapCircle': function (e) {
        d3.select(".list-group")
            .append("li")
            .attr("class", "modal-list-item list-group-item")
            .attr("value", 10)
            .attr("id", 10);
    },


    'click #submitDropdown' : function(e) {
    //    http://www.w3schools.com/jsref/coll_select_options.asp

    },

    'click #collapseFilterButton': function(e) {
        if (i % 2 == 0) { //Expanded version
            $('#filterBar').animate({
                opacity: 0
            }, 500, function() {});

            $('#resultBar').css({"width" : "98vw","position" :"fixed"});

            $(".glyphicon-arrow-left").addClass( "glyphicon-arrow-right");
            $(".glyphicon-arrow-right").removeClass( "glyphicon-arrow-left");

            $('#controlBar').animate({
                left: "0px"
            }, 500, function() {});

            $('.resultScatterPlotView').css({"width" : "47.3vw"});
            $('.resultMapView').css({"width" : "47.3vw"});
            $('.resultListView').css({"width" : "95.3vw"});


        } else { // Non expanded
            $('#filterBar').animate({
                opacity: 1
            }, 500, function() {});

            $('#resultBar').removeAttr("style");

            $(".glyphicon-arrow-right").addClass( "glyphicon-arrow-left");
            $(".glyphicon-arrow-left").removeClass( "glyphicon-arrow-right");

            $('#controlBar').removeAttr("style");

            $('.resultScatterPlotView').css({"width" : "34.9vw"});
            $('.resultMapView').css({"width" : "34.9vw"});
            $('.resultListView').css({"width" : "70.5vw"});


        }

        drawScatterPlot(globalFilter.top(Infinity), selectedX, selectedY);
        drawMap(globalFilter.top(Infinity));

        i++;
    },

    'click #resetAllFiltersButton': function(e) {
        dc.filterAll();
        dc.redrawAll();
        onChange();
        $("#breadcrumb li").remove();
        //$('.companiesCount').html(globalFilter.top(Infinity).length);
    },

    'click #resetAllScalesButton': function(e) {
        for (var i = 0; i < fields.length; i++) {
            document.getElementById(fields[i] + "Weight").value = "100";
        }
        onChange();
        $("#breadcrumb li").remove();
    },

    //'click #applyFilterButton': function (e) {
    //	console.log('checking database connection');
    //	console.log(Filters.find().count());
    //	console.log(Results.find().count());
    //	console.log(PDFs.find().count());
    //
    //	$('#saveResultButton').removeClass("disabled");
    //	$('#resultListViewButton').removeClass("disabled");
    //	$('#resultMapViewButton').removeClass("disabled");
    //	$('#resultScatterPlotViewButton').removeClass("disabled");
    //
    //	e.preventDefault();
    //
    //	//$('.initView').attr("style", "display: none");
    //	//$('.resultListView').attr("style", "display: block");
    //
    //	calculateIndex();
    //
    //	fillTable(globalFilter.top(Infinity).reverse());
    //	$(".rowInfo").hide();
    //
    //	drawBubblesOnMap(globalFilter.top(Infinity));
    //	drawScatterPlot(globalFilter.top(Infinity));
    //
    //	Filters.insert({
    //	});
    //},

    'click #sortByCompanyButton': function(e) {
        fillTable(globalFilter.top(Infinity).reverse())
    },

    'click #sortByIndustryButton': function(e) {
        fillTable(globalFilter.top(Infinity).sort(function(a,b) {
            return a.industry.localeCompare(b.industry);
        }))

    },

    'click #sortBySectorButton': function(e) {
        fillTable(globalFilter.top(Infinity).sort(function(a,b) {
            return a.sector.localeCompare(b.sector);
        }))
    },

    'click #sortByCountryButton': function(e) {
        fillTable(globalFilter.top(Infinity).sort(function(a,b) {
            return a.country.localeCompare(b.country);
        }))
    },

    'click #sortByScoreButton': function(e) {
        fillTable(globalFilter.top(Infinity).sort(function(a,b) {
            //if( !isFinite(a.sustIndex) && !isFinite(b.sustIndex) ) {
            //	return 0;
            //}
            //if( !isFinite(a.sustIndex) ) {
            //	return 1;
            //}
            //if( !isFinite(b.sustIndex) ) {
            //	return -1;
            //}
            //return a.sustIndex - b.sustIndex;
            if (isNaN(a.sustIndex) && isNaN(b.sustIndex)) {
                return 0;
            } else if (isNaN(a.sustIndex)) {
                return 1;
            } else if (isNaN(b.sustIndex)) {
                return -1;
            } else {
                return a.sustIndex - b.sustIndex;
            }
        }))
    },

    'click .scatterExpand': function(e) {
        var width = $("#resultBar").width();

        if (iScatter % 2 == 0) {
            $('.resultScatterPlotView').css({
                "height" : "89vh",
                "width" : width - 10
            });
            $(".resultListView").hide();
            $(".resultMapView").hide();

            drawScatterPlot(globalFilter.top(Infinity), selectedX, selectedY);
        } else {
            $('.resultScatterPlotView').css({
                "height" : "43vh",
                "width" : "34.9vw"
            });

            $(".resultListView").show();
            $(".resultMapView").show();
            drawScatterPlot(globalFilter.top(Infinity), selectedX, selectedY);
        }
        iScatter++;
    },

    'click .mapExpand': function(e) {
        var width = $("#resultBar").width();

        if (iMap % 2 == 0) {
            $('.resultMapView').css({
                "height" : "89vh",
                "width" : width - 10
            });

            $(".resultListView").hide();
            $(".resultScatterPlotView").hide();
            drawMap(globalFilter.top(Infinity));


        } else {
            $('.resultMapView').css({
                "height" : "43vh",
                "width" : "34.9vw"
            });

            $(".resultListView").show();
            $(".resultScatterPlotView").show();

            drawMap(globalFilter.top(Infinity));
        }
        iMap++;
    },

    'click .listExpand': function(e) {
        var width = $("#resultBar").width();
        var height = $("#resultBar").height();

        if (iList % 2 == 0) {
            $('.resultListView').css({
                "margin-top": "0",
                "height" : "89vh",
                "width" : width - 10
            });

            $(".resultScatterPlotView").hide();
            $(".resultMapView").hide();

        } else {
            $('.resultListView').css({
                "margin-top": "10px",
                "height" : "43vh",
                "width" : "70.7vw"
            });

            $(".resultScatterPlotView").show();
            $(".resultMapView").show();
        }
        iList++;
    }
});

Template.Home.helpers({
    pdfs: function () {
        return PDFs.find(); // Where Images is an FS.Collection instance
    }

});

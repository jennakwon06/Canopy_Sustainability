Template.Home.rendered = function() {
    // subscribe to databases
    Meteor.subscribe('userFilters');
    Meteor.subscribe('userResults');
    Meteor.subscribe('fs.files');
};

Template.Home.events({


    iScatter : 0,
    iMap : 0,
    iList : 0,

    'error' : function(e) {
        return false;
    },

    //<!------ CONTROL BAR ---->
    'click #resetEmissions' : function (e) {
        ghg1Chart.filterAll();
        ghg2Chart.filterAll();
        ghg3Chart.filterAll();
    },

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

        showInteractionElements($target.attr("name"), $target.attr("address"), false, false, true);
    },


    'click #collapseFilterButton': function(e) {
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
        $("#collapseFilterButton").attr("style", "display: none");
        $("#expandFilterButton").attr("style", "display: visible");

        changeAxisAndDrawScatterPlot();
        drawMap(globalFilter.top(Infinity));
    },

    'click #expandFilterButton': function(e) {
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
        $("#collapseFilterButton").attr("style", "display: visible");
        $("#expandFilterButton").attr("style", "display: none");

        changeAxisAndDrawScatterPlot();
        drawMap(globalFilter.top(Infinity));
    },

    'click #resetFilters': function(e) {
        dc.filterAll();
        dc.redrawAll();
        resetWeightSelectors();
        resetPage();
        removeBreadCrumb();
    },

    'click #sortByCompanyButton': function(e) {
        fillListViewTable(globalFilter.top(Infinity).reverse())
    },
    
    'click #sortByScoreButton': function(e) {
        fillListViewTable(globalFilter.top(Infinity).sort(function(a,b) {
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
    
    'click #sortByNumPDFReport': function(e) {
        fillListViewTable(globalFilter.top(Infinity).sort(function(a,b) {
            if (isNaN(a["# Available Reports"]) && isNaN(b["# Available Reports"])) {
                return 0;
            } else if (isNaN(a["# Available Reports"])) {
                return 1;
            } else if (isNaN(b["# Available Reports"])) {
                return -1;
            } else {
                return a["# Available Reports"] - b["# Available Reports"];
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

            changeAxisAndDrawScatterPlot()
        } else {
            $('.resultScatterPlotView').css({
                "height" : "43vh",
                "width" : "34vw"
            });

            $(".resultListView").show();
            $(".resultMapView").show();
            changeAxisAndDrawScatterPlot()
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
                "width" : "34vw"
            });

            $(".resultListView").show();
            $(".resultScatterPlotView").show();
            drawMap(globalFilter.top(Infinity));
        }
        iMap++;
    },

    'click .listExpand': function(e) {
        var width = $("#resultBar").width();

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
                "width" : "68.7vw"
            });

            $(".resultScatterPlotView").show();
            $(".resultMapView").show();
        }
        iList++;
    },

    'click #exportButton' : function(e) {
        var outputFile = "result.csv";
        exportToCsv.apply(this, [$('.resultListView > table'), outputFile]);

    }
});

Template.Home.helpers({
    pdfs: function () {
        return PDFs.find(); // Where Images is an FS.Collection instance
    }

});


function findPDFs(company) {
    // Check if database is correctly set up
    console.log(PDFs.find().count());
    console.log(PDFs.find({}));
    var regex = new RegExp('^' + company, 'i');
    // @TODO use regex to find a file by name
    return PDFs.find({}).fetch();
}

function exportToCsv($table, filename) {
    var $rows = $table.find('tr:nth-child(odd)')
    // Temporary delimiter characters unlikely to be typed by keyboard
    // This is to avoid accidentally splitting the actual contents
        ,tmpColDelim = String.fromCharCode(11) // vertical tab character
        ,tmpRowDelim = String.fromCharCode(0) // null character

    // actual delimiter characters for CSV format
        ,colDelim = '","'
        ,rowDelim = '"\r\n"';

    $rows[0].removeChild($rows[0].childNodes[0]);

    // Grab text from table into CSV formatted string
    var csv = '"';
    csv += formatRows($rows.map(grabRow)) + '"';

    // Data URI
    var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

    // For IE (tested 10+)
    if (window.navigator.msSaveOrOpenBlob) {
        var blob = new Blob([decodeURIComponent(encodeURI(csv))], {
            type: "text/csv;charset=utf-8;"
        });
        navigator.msSaveBlob(blob, filename);
    } else {
        $("#exportButton")
            .attr({
                'download': filename
                ,'href': csvData
                ,'target' : '_blank' //if you want it to open in a new window
            });
    }

    //------------------------------------------------------------
    // Helper Functions
    //------------------------------------------------------------
    // Format the output so it has the appropriate delimiters
    function formatRows(rows){
        return rows.get().join(tmpRowDelim)
            .split(tmpRowDelim).join(rowDelim)
            .split(tmpColDelim).join(colDelim);
    }
    // Grab and format a row from the table
    function grabRow(i,row){
        var first = true;

        var $row = $(row);
        //for some reason $cols = $row.find('td') || $row.find('th') won't work...
        var $cols = $row.find('td');
        if(!$cols.length) $cols = $row.find('th:gt(0)');

        return $cols.map(grabCol)
            .get().join(tmpColDelim);
    }
    // Grab and format a column from the table
    function grabCol(j,col){
        var $col = $(col),
            $text = $col.text();

        return $text.replace('"', '""'); // escape double quotes

    }
}
// ### Create Chart Objects


//STANDARDIZE VAR NAMES TO CAMEL CASE!

var companiesCount = dc.dataCount('.companiesCount');

var industryChart = dc.scrollableRowChart('#industry_chart');
var sectorChart = dc.scrollableRowChart('#sector_chart');

var ghg1Chart = dc.barChart('#ghg1Chart');
var ghg2Chart = dc.barChart('#ghg2Chart');
var ghg3Chart = dc.barChart('#ghg3Chart');


// WATER
var totalWaterUseChart = dc.barChart('#totalWaterUseChart');
var totalWaterWithdrawlChart = dc.barChart('#totalWaterWithdrawlChart');
var totalWaterDischargedChart = dc.barChart('#totalWaterDischargedChart');

// WASTE
var totalWasteChart = dc.barChart("#totalWasteChart");
var wasteRecycledChart = dc.barChart("#wasteRecycledChart");
var wasteSentToLandfillChart = dc.barChart("#wasteSentToLandfillChart");

// ENERGY
var totalEnergyConsumptionChart = dc.barChart("#totalEnergyConsumptionChart");


//var ccPolicyImplRowChart;

//GLOBAL VARIABLES
var FULL_CHART_WIDTH = 330;
var HALF_CHART_WIDTH = 160;
var FULL_CHART_HEIGHT = 200;
var HALF_CHART_HEIGHT = 60;

var globalFilter;
var sp500;
var globalData;

var fields = ["ghg1", "ghg2", "ghg3"
    , "totalWaterUse", "totalWaterWithdrawl", "totalWaterDischarged"
    , "totalWaste", "wasteRecycled", "wasteSentToLandfill"
    , "totalEnergyConsumption" ];

/*
 * Check if csv cell is empty
 */

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

function calculateIndex() {
    // calculate max index;
    var i;
    var maxValues = [];
    for (i = 0; i < fields.length; i++) {
        maxValues.push(d3.extent(globalData, function (d) {return +d[fields[i]];})[1]);
    }

    //var totalWeight = 0;
    //for (i = 0; i < fields.length; i++) {
    //    totalWeight += parseInt(document.getElementById(fields[i] + "Weight").value);
    //}

    //console.log("totalWeight");
    //console.log(totalWeight);

    // add normalized weights
    //var weights = [];
    //for (i = 0; i < fields.length; i++) {
    //    weights.push(document.getElementById(fields[i] + "Weight").value / totalWeight);
    //}

    //console.log("weights");
    //console.log(weights);


    globalData.forEach(function (d) {
        var curScore = 0;
        var totalWeight = 0;

        var arr = [];

        for (i = 0; i < fields.length; i++) {
            if (+d[fields[i]]) {
                totalWeight += parseInt(document.getElementById(fields[i] + "Weight").value);
            }
        }

        for (i = 0; i < fields.length; i++) {
            //console.log(+d[fields[i]]);
            if (+d[fields[i]]) {
                var object = {
                    name: "",
                    weight: 0,
                    value: 0
                };
                object.name = fields[i];
                object.weight = document.getElementById(fields[i] + "Weight").value / totalWeight;
                object.value = +d[fields[i]];
                arr.push(object);
                curScore += +d[fields[i]] / maxValues[i] * object.weight;
            }
        }
        d.dataInfo = arr;
        //console.log("array for company" + d.name);
        //console.log(arr);
        d.sustIndex = curScore;
    });
}

// ### Anchor Div for Charts
/*
 // A div anchor that can be identified by id
 <div id='your-chart'></div>
 // Title or anything you want to add above the chart
 <div id='chart'><span>Days by Gain or Loss</span></div>
 // ##### .turnOnControls()

 // If a link with css class `reset` is present then the chart
 // will automatically hide/show it based on whether there is a filter
 // set on the chart (e.g. slice selection for pie chart and brush
 // selection for bar chart). Enable this with `chart.turnOnControls(true)`

 // dc.js >=2.1 uses `visibility: hidden` to hide/show controls without
 // disrupting the layout. To return the old `display: none` behavior,
 // set `chart.controlsUseVisibility(false)` and use that style instead.
 <div id='chart'>
 <a class='reset'
 href='javascript:myChart.filterAll();dc.redrawAll();'
 style='visibility: hidden;'>reset</a>
 </div>
 // dc.js will also automatically inject the current filter value into
 // any html element with its css class set to `filter`
 <div id='chart'>
 <span class='reset' style='visibility: hidden;'>
 Current filter: <span class='filter'></span>
 </span>
 </div>
 */

d3.csv('/data/master.csv', function (data) {

    globalData = data;

    var numberFormat = d3.format('.2f');

    data.forEach(function (d) {

        //Ticker,Name,address,latitude,longitude,registered Country Location,ISIN,ICB Industry Name,ICB Sector Name
        d.name = d["Name"];
        d.latitude = d["latitude"];
        d.longitude = d["longitude"];
        d.address = d["address"];
        d.country = d["Registered Country Location"];
        d.industry = d["ICB Industry Name"];
        d.sector = d["ICB Sector Name"];
        d.isin = d["ISIN"];

        //Climate Chg Pol:Y,Equal Opp Pol:Y,Water Policy,Human Rights Pol:Y, Energy Effic Pol:Y,Bus Ethics Pol:Y,Biodiv Pol:Y,
        d.ccImplemented = d["Climate Chg Pol:Y"];
        d.wasteReductionPolicy = d["Waste Reduc Pol:Y"];

        //Revenue T12M, Price
        d.revenue = d["Revenue T12M"];
        d.price = d["Price"];

        // Total Water Withdrawal
        // Tot Wtr Dschgd:Y
        // Tot Wtr Use:Y
        d.totalWaterUse = d["Tot Wtr Use:Y"]; // total water use * 1,000,000 / sales, ESO16
        d.totalWaterWithdrawl = d["Total Water Withdrawal"]; // thousands of cubic meters
        d.totalWaterDischarged = d["Tot Wtr Dschgd:Y"]; // thousands of cubic meters

        //Waste Recycl:Y,Total Waste:Y,Wste Sent to Ldflls:Y
        d.totalWaste = d["Total Waste:Y"];         //Total waste is ESO20
        d.wasteSentToLandfill = d["Wste Sent to Ldflls:Y"]; //thousands of metric tons
        d.wasteRecycled = d["Waste Recycl:Y"]; //total waste / total assets

        // Energy Consump:Y
        d.totalEnergyConsumption = d["Energy Consump:Y"]; //  ESO14 : thousands of megawatt hours

        //GHG Scope 3:Y,GHG Scope 2:Y,GHG Scope 1:Y
        d.ghg3 = d["GHG Scope 3:Y"]; // thousands of metric tons
        d.ghg2 = d["GHG Scope 2:Y"];
        d.ghg1 = d["GHG Scope 1:Y"]; // thousands of metric tons

    });

    //### Create Crossfilter Dimensions and Groups. NOTE: BE CAREFUL OF HOW MANY DIMENSIONS YOU INSTANTIATE
    sp500 = crossfilter(data);

    var all = sp500.groupAll();

    // GENERAL
    globalFilter = sp500.dimension(function (d) {return d.name;});

    var industry = sp500.dimension(function (d) {return d.industry;});
    var sector = sp500.dimension(function (d) {return d.sector;});

    // EMISSIONS

    var ghg1 = sp500.dimension(function (d) {return +d.ghg1;});
    var ghg2 = sp500.dimension(function (d) {return +d.ghg2;});
    var ghg3 = sp500.dimension(function (d) {return +d.ghg3;});

    // WATER
    var totalWaterUse = sp500.dimension(function (d) {return +d.totalWaterUse;});
    var totalWaterWithdrawl = sp500.dimension(function (d) {return +d.totalWaterWithdrawl;});
    var totalWaterDischarged = sp500.dimension(function (d) {return +d.totalWaterDischarged;});

    // WASTE
    var totalWaste = sp500.dimension(function (d) {return +d.totalWaste;});
    var wasteSentToLandfill = sp500.dimension(function (d) {return +d.wasteSentToLandfill;});
    var wasteRecycled = sp500.dimension(function (d) {return +d.wasteRecycled;});

    //ENERGY
    var totalEnergyConsumption = sp500.dimension(function (d) {return +d.totalEnergyConsumption;});

    // PIE CHARTS
    var riskExp = sp500.dimension(function (d) {return d.riskExp == "1" ? 'Yes' : 'No';});
    var ccImplemented = sp500.dimension(function (d) {return d.ccImplemented == "1" ? 'Yes' : 'No';});
    //var WasteReductionPolicy = sp500.dimension(function (d) {return d.wasteReductionPolicy == "1" ? 'Yes' : 'No';});

    companiesCount
        .dimension(sp500)
        .group(all)
        .html({
            some: '<strong>%filter-count</strong> / <strong>%total-count</strong>',
            all: '<strong>%total-count</strong>'
        });


    //ROW CHART: INDUSTRY CHART
    (function() {
        var industryGroup = industry.group();

        industryChart /* dc.rowChart('#day-of-week-chart', 'chartGroup') */
            .width(HALF_CHART_WIDTH)
            .height(HALF_CHART_HEIGHT)
            .margins({top: 0, left: 0, right: 0, bottom: 20})
            .group(industryGroup)
            .dimension(industry)
            // Assign colors to each value in the x scale domain
            .ordinalColors(['#3C8D2F', '#3C8D2F', '#3C8D2F'])
            .label(function (d) {
                return d.key;
            })
            // Title sets the row text
            .title(function (d) {
                return d.value;
            })
            .elasticX(true)
            .controlsUseVisibility(true)
            .xAxis().ticks(8, ",.1s").tickSize(6, 0).ticks(4);
    }());

    //ROW CHART: SECTOR CHART
    (function() {
        var sectorGroup = sector.group();

        sectorChart /* dc.rowChart('#day-of-week-chart', 'chartGroup') */
            .width(HALF_CHART_WIDTH)
            .height(HALF_CHART_HEIGHT)
            .margins({top: 0, left: 0, right: 0, bottom: 20})
            .group(sectorGroup)
            .dimension(sector)
            // Assign colors to each value in the x scale domain
            .ordinalColors(['#3C8D2F', '#3C8D2F', '#3C8D2F'])
            .label(function (d) {
                return d.key;
            })
            // Title sets the row text
            .title(function (d) {
                return d.value;
            })
            .elasticX(true)
            .controlsUseVisibility(true)
            .xAxis().ticks(8, ",.1s").tickSize(6, 0).ticks(4);

    }());


    (function() {

        //http://stackoverflow.com/questions/15191258/properly-display-bin-width-in-barchart-using-dc-js-and-crossfilter-js
        //console.log("printing ghg1");
        //console.log(ghg1.top(Infinity));
        //var arr = [];
        //ghg1.forEach(function (x) {
        //    console.log(x);
        //    //arr.push(+x.ghg1);
        //});
        //http://jrideout.github.io/histogram-pretty/
        //var hist = histogram(arr);
        //console.log(hist);

        var binCount = 100;
        var minMax = d3.extent(data, function (d) {return +d.ghg1;});
        var min = minMax[0];
        var max = minMax[1];
        var binWidth = (max - min) / binCount;


        //var ghg1Group = ghg1.group(function(d) {
        //    if (d) {
        //        return Math.floor(+d / binWidth) * binWidth;
        //    }
        //});

        var ghg1Group = ghg1.group().reduce(reduceAdd, reduceRemove, reduceInitial);

        function reduceAdd(p, v) {
            if (p == 1) {
                return v;
            }
            return p + 1;
        }

        function reduceRemove(p, v) {
            return p - 1;
        }

        function reduceInitial() {
            return 0;
        };

        //var ghg1UndefinedGroup = ghg1.group(function(d) {
        //    if (!d) {
        //        return d;
        //    }
        //});
        //
        //console.log("printing ghg1 group");
        //console.log(ghg1Group.all());
        //console.log(ghg1Group.top(2)[1]);

        ghg1Chart
            .width(FULL_CHART_WIDTH)
            .margins({top: 10, right: 5, bottom: 20, left: 0})
            .height(HALF_CHART_HEIGHT)
            .dimension(ghg1)
            .group(ghg1Group)
            .elasticY(true)
            .gap(5)
            .round(dc.round.floor)
            .alwaysUseRounding(true)
            .x(d3.scale.log().nice().domain([1, max]))
            .xAxis().ticks(8, ",.1s").tickSize(6, 0)
            .ticks(8, ",.1s")
            .tickSize(6, 0); //.tickFormat(function(v) { //https://github.com/mbostock/d3/wiki/SVG-Axes

        ghg1Chart.yAxis().ticks(0);



        //Note: for log scales, the number of ticks cannot be customized;
        // however, the number of tick labels can be customized via ticks.
        // Likewise, the tick formatter for log scales is typically specified via ticks rather than tickFormat,
        // so as to preserve the default label-hiding behavior.

    }());

//    BAR CHART: ghg2
    (function() {
        var binCount = 100;
        var minMax = d3.extent(data, function (d) {return +d.ghg2;});
        var min = minMax[0];
        var max = minMax[1];
        var binWidth = (max - min) / binCount;
        var ghg2Group = ghg2.group().reduce(reduceAdd, reduceRemove, reduceInitial);

        function reduceAdd(p, v) {
            if (p == 1) {
                return v;
            }
            return p + 1;
        }

        function reduceRemove(p, v) {
            return p - 1;
        }

        function reduceInitial() {
            return 0;
        };

        ghg2Chart
            .width(FULL_CHART_WIDTH)
            .margins({top: 10, right: 5, bottom: 20, left: 0})
            .height(HALF_CHART_HEIGHT)
            .dimension(ghg2)
            .group(ghg2Group)
            .elasticY(true)
            .gap(5)
            .round(dc.round.floor)
            .alwaysUseRounding(true)
            .x(d3.scale.log().nice().domain([1, max]))
            .xAxis().ticks(8, ",.1s").tickSize(6, 0);
    }());

    //BAR CHART: GHG3
    (function(){
        var binCount = 100;
        var minMax = d3.extent(data, function (d) {return +d.ghg3;});
        var min = minMax[0];
        var max = minMax[1];
        var binWidth = (max - min) / binCount;
        var ghg3Group = ghg3.group().reduce(reduceAdd, reduceRemove, reduceInitial);

        function reduceAdd(p, v) {
            if (p == 1) {
                return v;
            }

            return p + 1;
        }

        function reduceRemove(p, v) {
            return p - 1;
        }

        function reduceInitial() {
            return 0;
        }

        ghg3Chart
            .width(FULL_CHART_WIDTH)
            .margins({top: 10, right: 5, bottom: 20, left: 0})
            .height(HALF_CHART_HEIGHT)
            .dimension(ghg3)
            .group(ghg3Group)
            .elasticY(true)
            .gap(5)
            .round(dc.round.floor)
            .alwaysUseRounding(true)
            .x(d3.scale.log().nice().domain([1, max]))
            .xAxis().ticks(8, ",.1s").tickSize(6, 0)

    }());

    //BAR CHART: WATER INTENSITY PER SALES
    (function() {
        var binCount = 100;
        var minMax = d3.extent(data, function (d) {return +d.totalWaterUse;});
        var min = minMax[0];
        var max = minMax[1];
        var binWidth = (max - min) / binCount;
        var waterIntensityGroup = totalWaterUse.group().reduce(reduceAdd, reduceRemove, reduceInitial);

        function reduceAdd(p, v) {
            if (p == 1) {
                return v;
            }

            return p + 1;
        }

        function reduceRemove(p, v) {
            return p - 1;
        }

        function reduceInitial() {
            return 0;
        };

        totalWaterUseChart
            .width(FULL_CHART_WIDTH)
            .margins({top: 10, right: 5, bottom: 20, left: 0})
            .height(HALF_CHART_HEIGHT)
            .dimension(totalWaterUse)
            .group(waterIntensityGroup)
            .elasticY(true)
            .gap(5)
            .round(dc.round.floor)
            .alwaysUseRounding(true)
            .x(d3.scale.log().nice().domain([1, max]))
            .xAxis().ticks(8, ",.1s").tickSize(6, 0)

    }());

    //BAR CHART: WATER WITHDRAWL
    (function() {
        var binCount = 100;
        var minMax = d3.extent(data, function (d) {return +d.totalWaterWithdrawl;});
        var min = minMax[0];
        var max = minMax[1];
        var binWidth = (max - min) / binCount;
        var tWWGroup = totalWaterWithdrawl.group().reduce(reduceAdd, reduceRemove, reduceInitial);

        function reduceAdd(p, v) {
            if (p == 1) {
                return v;
            }

            return p + 1;
        }

        function reduceRemove(p, v) {
            return p - 1;
        }

        function reduceInitial() {
            return 0;
        };

        totalWaterWithdrawlChart
            .width(FULL_CHART_WIDTH)
            .margins({top: 10, right: 5, bottom: 20, left: 0})
            .height(HALF_CHART_HEIGHT)
            .dimension(totalWaterWithdrawl)
            .group(tWWGroup)
            .elasticY(true)
            .gap(5)
            .round(dc.round.floor)
            .alwaysUseRounding(true)
            .x(d3.scale.log().nice().domain([1, max]))
            .xAxis().ticks(8, ",.1s").tickSize(6, 0)
    }());

    //BAR CHART: WATER DISCHARGED
    (function() {
        var binCount = 100;
        var minMax = d3.extent(data, function (d) {return +d.totalWaterDischarged;});
        var min = minMax[0];
        var max = minMax[1];
        var binWidth = (max - min) / binCount;
        var totalWaterDischargedGroup = totalWaterDischarged.group().reduce(reduceAdd, reduceRemove, reduceInitial);

        function reduceAdd(p, v) {
            if (p == 1) {
                return v;

            }
            return p + 1;
        }

        function reduceRemove(p, v) {
            return p - 1;
        }

        function reduceInitial() {
            return 0;
        };

        totalWaterDischargedChart
            .width(FULL_CHART_WIDTH)
            .margins({top: 10, right: 5, bottom: 20, left: 0})
            .height(HALF_CHART_HEIGHT)
            .dimension(totalWaterDischarged)
            .group(totalWaterDischargedGroup)
            .elasticY(true)
            .gap(5)
            .round(dc.round.floor)
            .alwaysUseRounding(true)
            .x(d3.scale.log().nice().domain([1, max]))
            .xAxis().ticks(8, ",.1s").tickSize(6, 0);
    }());

    //BAR CHART: WASTE INTENSITY PER SALES
    (function() {
        var binCount = 100;
        var minMax = d3.extent(data, function (d) {return +d.totalWaste;});
        var min = minMax[0];
        var max = minMax[1];
        var binWidth = (max - min) / binCount;
        var wasteIntensityGroup = totalWaste.group().reduce(reduceAdd, reduceRemove, reduceInitial);

        function reduceAdd(p, v) {
            if (p == 1) {
                return v;
            }
            return p + 1;
        }

        function reduceRemove(p, v) {
            return p - 1;
        }

        function reduceInitial() {
            return 0;
        };

        totalWasteChart
            .width(FULL_CHART_WIDTH)
            .margins({top: 10, right: 5, bottom: 20, left: 0})
            .height(HALF_CHART_HEIGHT)
            .dimension(totalWaste)
            .group(wasteIntensityGroup)
            .elasticY(true)
            .gap(5)
            .round(dc.round.floor)
            .alwaysUseRounding(true)
            .x(d3.scale.log().nice().domain([1, max]))
            .xAxis().ticks(8, ",.1s").tickSize(6, 0);
    }());

    //BAR CHART: WASTE SENT TO LANDFILL
    (function() {
        var binCount = 100;
        var minMax = d3.extent(data, function (d) {return +d.wasteSentToLandfill;});
        var min = minMax[0];
        var max = minMax[1];
        var binWidth = (max - min) / binCount;
        var wasteSentToLandFillGroup = wasteSentToLandfill.group().reduce(reduceAdd, reduceRemove, reduceInitial);

        function reduceAdd(p, v) {
            if (p == 1) {
                return v;
            }
            return p + 1;
        }

        function reduceRemove(p, v) {
            return p - 1;
        }

        function reduceInitial() {
            return 0;
        };

        wasteSentToLandfillChart
            .width(FULL_CHART_WIDTH)
            .margins({top: 10, right: 5, bottom: 20, left: 0})
            .height(HALF_CHART_HEIGHT)
            .dimension(wasteSentToLandfill)
            .group(wasteSentToLandFillGroup)
            .elasticY(true)
            .gap(5)
            .round(dc.round.floor)
            .alwaysUseRounding(true)
            .x(d3.scale.log().nice().domain([1, max]))
            .xAxis().ticks(8, ",.1s").tickSize(6, 0);
    }());

    //BAR CHART: WASTE RECYCLED
    (function() {
        var binCount = 100;
        var minMax = d3.extent(data, function (d) {return +d.wasteRecycled;});
        var min = minMax[0];
        var max = minMax[1];
        var binWidth = (max - min) / binCount;
        var wgGroup = wasteRecycled.group().reduce(reduceAdd, reduceRemove, reduceInitial);

        function reduceAdd(p, v) {
            if (p == 1) {
                return v;
            }
            return p + 1;
        }

        function reduceRemove(p, v) {
            return p - 1;
        }

        function reduceInitial() {
            return 0;
        };

        wasteRecycledChart
            .width(FULL_CHART_WIDTH)
            .margins({top: 10, right: 5, bottom: 20, left: 0})
            .height(HALF_CHART_HEIGHT)
            .dimension(wasteRecycled)
            .group(wgGroup)
            .elasticY(true)
            .gap(5)
            .round(dc.round.floor)
            .alwaysUseRounding(true)
            .x(d3.scale.log().nice().domain([1, max]))
            .xAxis().ticks(8, ",.1s").tickSize(6, 0);
    }());

    //BAR CHART: total energy consumped
    (function() {
        var binCount = 100;
        var minMax = d3.extent(data, function (d) {return +d.totalEnergyConsumption;});
        var min = minMax[0];
        var max = minMax[1];
        var binWidth = (max - min) / binCount;
        var group = totalEnergyConsumption.group().reduce(reduceAdd, reduceRemove, reduceInitial);

        function reduceAdd(p, v) {
            if (p == 1) {
                return v;
            }
            return p + 1;
        }

        function reduceRemove(p, v) {
            return p - 1;
        }

        function reduceInitial() {
            return 0;
        };

        totalEnergyConsumptionChart
            .width(FULL_CHART_WIDTH)
            .margins({top: 10, right: 5, bottom: 20, left: 0})
            .height(HALF_CHART_HEIGHT)
            .dimension(totalEnergyConsumption)
            .group(group)
            .elasticY(true)
            .gap(5)
            .round(dc.round.floor)
            .alwaysUseRounding(true)
            .x(d3.scale.log().nice().domain([1, max]))
            .xAxis().ticks(8, ",.1s").tickSize(6, 0);
    }());
    
    
    // BINARY BARS
    (function() {
        // Produce counts records in the dimension
        var ccImplementedGroup = ccImplemented.group();
    
        //reply to http://stackoverflow.com/questions/29360042/how-to-create-stacked-row-chart-with-one-row-with-dc-js
    
        var chart = d3.select("#ccPolicyImplRowChart");
    
        console.log(chart);
        console.log(ccImplementedGroup);
    
        var bar = chart.selectAll("div")
            .data(ccImplementedGroup)
            .enter().append("div")
            .attr('data-tooltip',function(d,i){ return d.Name} )
            .attr('style',function(d,i){
                console.log(ccImplementedGroup);
                return (
                    'flex:' + d.value + '; '
                    + 'background:' + color(i) + ';'
                )
            }).on("click",function(d,i){
                updateElements(data);
                d3.select("#rowChart")
                    .selectAll("div")
                    .attr("class", function(e, j) { return j != i ? "deselected" : "selected";
                    });
            });
    
    
    
        function updateElements(data){
        }
    
        //ccPolicyImplRowChart
        //    .width(150)// (optional) define chart height, `default = 200`
        //    .height(150)// Define pie radius
        //    .radius(75)// Set dimension
        //    .dimension(ccImplemented)
        //    .group(ccImplementedGroup)
        //    .label(function (d) {
        //        if (ccPolicyImplChart.hasFilter() && !ccPolicyImplChart.hasFilter(d.key)) {
        //            return d.key + '(0%)';
        //        }
        //        var label = d.key;
        //        if (all.value()) {
        //            label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
        //        }
        //        return label;
        //    });
    
    }());



    //#### Rendering

    //simply call `.renderAll()` to render all charts on the page
    dc.renderAll();
    dc.redrawAll();

    /*
     // Or you can render charts belonging to a specific chart group
     dc.renderAll('group');
     // Once rendered you can call `.redrawAll()` to update charts incrementally when the data
     // changes, without re-rendering everything
     // Or you can choose to redraw only those charts associated with a specific chart group
     dc.redrawAll('group');
     */

    //rotateLabels();

});

function rotateLabels() {
    d3.selectAll(".axis.x").selectAll(".tick text").style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-65)"
        });
}

histogram = function(vector,options) {

    options = options || {};
    options.copy = options.copy === undefined ? true : options.copy;
    options.pretty = options.pretty === undefined ? true : options.pretty;

    var s = vector;
    if (options.copy) s = s.slice();
    s.sort(function (a, b) { return a - b; });

    // TODO: use http://www.austinrochford.com/posts/2013-10-28-median-of-medians.html
    // without sorting
    function quantile(p) {
        var idx = 1 + (s.length - 1) * p,
            lo = Math.floor(idx),
            hi = Math.ceil(idx),
            h  = idx - lo;
        return (1-h) * s[lo] + h * s[hi];
    }

    function freedmanDiaconis() {
        var iqr = quantile(0.75) - quantile(0.25);
        return 2 * iqr * Math.pow(s.length,-1/3);
    }

    function pretty(x) {
        var scale = Math.pow(10, Math.floor(Math.log(x/10) / Math.LN10)),
            err   = 10 / x * scale;
        if (err <= 0.15) scale *= 10;
        else if (err <= 0.35) scale *= 5;
        else if (err <= 0.75) scale *= 2;
        return scale * 10;
    }

    var h = freedmanDiaconis();
    if (options.pretty) h = pretty(h);

    function bucket(d) {
        return h * Math.floor(d / h);
    }

    function tickRange(n) {
        var extent  = [bucket(s[0]), h + bucket(s[s.length-1])],
            buckets = Math.round((extent[1] - extent[0]) / h),
            step    = buckets > n ? Math.round(buckets / n) : 1,
            pad     = buckets % step; // to center whole step markings
        return [extent[0] + h * Math.floor(pad/2),
            extent[1] - h * Math.ceil(pad/2) + h*0.5, // pad upper extent for d3.range
            h * step];
    }

    return {
        size: h,
        fun: bucket,
        tickRange: tickRange
    };
};


//#### Versions

//Determine the current version of dc with `dc.version`
d3.selectAll('#version').text(dc.version);

// Determine latest stable version in the repo via Github API
d3.json('https://api.github.com/repos/dc-js/dc.js/releases/latest', function (error, latestRelease) {
    /*jshint camelcase: false */
    d3.selectAll('#latest').text(latestRelease.tag_name); /* jscs:disable */
});

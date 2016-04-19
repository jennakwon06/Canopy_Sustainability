// ### Create Chart Objects


//STANDARDIZE VAR NAMES TO CAMEL CASE!


var industryChart = dc.scrollableRowChart('#industry_chart');
var sectorChart = dc.scrollableRowChart('#sector_chart');

//var ghg1Chart = dc.barChart('#ghg1Chart');
var ghg2Chart = dc.barChart('#ghg2Chart');
var ghg3Chart = dc.barChart('#ghg3Chart');

//WATER
//var waterIntensityPerSalesChart = dc.barChart('#waterIntensityPerSalesChart');
//var totalWaterWithdrawlChart = dc.barChart('#totalWaterWithdrawlChart');
//var totalWaterDischargedChart = dc.barChart('#totalWaterDischargedChart');
//
//// WASTE
//var wasteIntensityPerSalesChart = dc.barChart("#wasteIntensityPerSalesChart");
//var wasteGeneratedPerAssetsChart = dc.barChart("#wasteGeneratedPerAssets");
//var wasteSentToLandfillChart = dc.barChart("#wasteSentToLandfillChart");
//
//// ENERGY
//var energyIntensityPerSalesChart = dc.barChart("#energyIntensityPerSalesChart");
//
//var riskExposedChart = dc.pieChart('#riskExposedChart');
//var ccPolicyImplChart = dc.pieChart('#ccPolicyImplChart');

//GLOBAL VARIABLES
var FULL_CHART_WIDTH = 400;
var HALF_CHART_WIDTH = 160;
var FULL_CHART_HEIGHT = 250;
var HALF_CHART_HEIGHT = 140;

var globalFilter;
var sp500;

/*
 * Check if csv cell is empty
 */
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
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

    var numberFormat = d3.format('.2f');
    // Ticker,Name,Weight,Shares,Price,Climate Chg Pol:Y,Equal Opp Pol:Y,Water Policy,Human Rights Pol:Y,Energy Effic Pol:Y,
    // Bus Ethics Pol:Y,Biodiv Pol:Y,Registered State Location,Product/Geographic Revenue,Revenue T12M,CDP Rep CH4 MetTon:Y,
    // CDP Rep PFC MetTon:Y,CDP Rep HFC MetTon:Y,ISIN,ICB Industry Name,ICB Sector Name,Registered Country Location,
    // Total Water Withdrawal,Tot Wtr Dschgd:Y,Wtr Intens/Sls:Y,Wste Per Sls:Y,Engy Intens/Sls:Y,Energy Intensity per Assets,
    // Wste Sent to Ldflls:Y,Waste Generated per Assets,GHG Scope 3:Y,GHG Scope 2:Y,ROE:Y,AZS,Rev - 1 Yr Gr:Y


    data.forEach(function (d) {
        d.name = d["Name"];

        d.riskExp = d["Reg Risk Exp:Y"];
        d.ccImplemented = d["Climate Chg Pol:Y"];
        d.wasteReductionPolicy = d["Waste Reduc Pol:Y"];


        d.country = d["Registered Country Location"];
        d.industry = d["ICB Industry Name"];
        d.sector = d["ICB Sector Name"];
        d.isin = d["ISIN"];

        d.revenue = d["Revenue T12M"];
        d.price = d["Price"];

        //Water
        d.waterIntensityPersales = d["Wtr Intens/Sls:Y"];
        d.totalWaterWithdrawl = d["Total Water Withdrawal"];
        d.totalWaterDischarged = d["Tot Wtr Dschgd:Y"];

        //Waste
        d.wasteSentToLandfill = d["Wste Sent to Ldflls:Y"];
        d.wasteIntensityPerSales = d["Wste Per Sls:Y"];
        d.wasteGeneratedPerAssets = d["Waste Generated per Assets"];

        //Energy
        d.energyIntensityPerSales = d["Engy Intens/Sls:Y"];

        //Emissions
        d.GHG3 = d["GHG Scope 3:Y"];
        d.GHG2 = d["GHG Scope 2:Y"];
        d.GHG1 = d["GHG Scope 1:Y"];

        d.latitude = d["latitude"];
        d.longitude = d["longitude"];
        d.address = d["address"];

    });

    //### Create Crossfilter Dimensions and Groups. NOTE: BE CAREFUL OF HOW MANY DIMENSIONS YOU INSTANTIATE
    sp500 = crossfilter(data);

    var all = sp500.groupAll();

    // GENERAL
    // USEFUL FOR FILLING TABLES
    globalFilter = sp500.dimension(function (d) {return d.name;});

    var industry = sp500.dimension(function (d) {return d.industry;});
    var sector = sp500.dimension(function (d) {return d.sector;});

    // EMISSIONS

    var GHG3 = sp500.dimension(function (d) {return d.GHG3;});

    // WATER
    var waterIntensityPerSales = sp500.dimension(function (d) {return d.waterIntensityPersales;});
    var totalWaterWithdrawl = sp500.dimension(function (d) {return d.totalWaterWithdrawl;});
    var totalWaterDischarged = sp500.dimension(function (d) {return d.totalWaterDischarged;});

    // WASTE
    var wasteIntensityPerSales = sp500.dimension(function (d) {return d.wasteIntensityPerSales;});
    var wasteSentToLandfill = sp500.dimension(function (d) {return d.wasteSentToLandfill;});
    var wasteGeneratedPerAssets = sp500.dimension(function (d) {return d.wasteGeneratedPerAssets;});
    var energyIntensityPerSales = sp500.dimension(function (d) {return d.energyIntensityPerSales;});

    // PIE CHARTS
    var riskExp = sp500.dimension(function (d) {return d.riskExp == "1" ? 'Yes' : 'No';});
    var ccImplemented = sp500.dimension(function (d) {return d.ccImplemented == "1" ? 'Yes' : 'No';});
    //var WasteReductionPolicy = sp500.dimension(function (d) {return d.wasteReductionPolicy == "1" ? 'Yes' : 'No';});

    //ROW CHART: INDUSTRY CHART
    (function() {
        var industryGroup = industry.group();

        industryChart /* dc.rowChart('#day-of-week-chart', 'chartGroup') */
            .width(HALF_CHART_WIDTH)
            .height(HALF_CHART_HEIGHT)
            .margins({top: 0, left: 0, right: 10, bottom: 10})
            .group(industryGroup)
            .dimension(industry)
            // Assign colors to each value in the x scale domain
            .ordinalColors(['#3182bd', '#6baed6', '#9ecae1'])
            .label(function (d) {
                return d.key;
            })
            // Title sets the row text
            .title(function (d) {
                return d.value;
            })
            .elasticX(true)
            .controlsUseVisibility(true)
            .xAxis().ticks(4);
    }());

    //ROW CHART: SECTOR CHART
    (function() {
        var sectorGroup = sector.group();

        console.log(sectorGroup.all());

        sectorChart /* dc.rowChart('#day-of-week-chart', 'chartGroup') */
            .width(HALF_CHART_WIDTH)
            .height(HALF_CHART_HEIGHT)
            .margins({top: 0, left: 0, right: 10, bottom: 10})
            .group(sectorGroup)
            .dimension(sector)
            // Assign colors to each value in the x scale domain
            .ordinalColors(['#3182bd', '#6baed6', '#9ecae1'])
            .label(function (d) {
                return d.key;
            })
            // Title sets the row text
            .title(function (d) {
                return d.value;
            })
            .elasticX(true)
            .controlsUseVisibility(true)
            .xAxis().ticks(4);

    }());

    //BAR CHART: GHG1
    //(function() {
    //
    //    var GHG1 = sp500.dimension(function (d) {return d.GHG1;});
    //
    //    var minMax = d3.extent(data, function (d) {
    //        return +d.GHG1;
    //    });
    //    var min = minMax[0];
    //    var max = minMax[1];
    //    var binCount = 10;
    //    var span = max - min;
    //
    //    var GHG1bins = ['Unknown'];
    //
    //    for (var i = 0; i <= binCount; i++) {
    //        GHG1bins.push((Math.floor(span / binCount) * i).toString());
    //    }
    //
    //    console.log(GHG1bins);
    //
    //    var GHG1Group = GHG1.group(function(d) {
    //        if (!d) {
    //            //console.log("where am I 1");
    //            return 'Unknown';
    //        } else {
    //            console.log("where am I 2");
    //            //console.log(d);
    //            console.log(GHG1bins[Math.ceil((+d * binCount) / max) + 1]);
    //            return +GHG1bins[Math.ceil((+d * binCount) / max) + 1]; // add two because first two elems are "" and "Unknown"
    //        }
    //    });
    //
    //
    //    console.log(GHG1Group.all());
    //
    //    ghg1Chart
    //        .width(FULL_CHART_WIDTH)
    //        .margins({top: 10, right: 20, bottom: 40, left: 40})
    //        .height(FULL_CHART_HEIGHT)
    //        .x(d3.scale.ordinal().domain(GHG1bins))
    //        .xUnits(dc.units.ordinal)
    //        .dimension(GHG1bins)
    //        .group(GHG1Group)
    //        .centerBar(true)
    //        .gap(5)
    //        .filterHandler(function (dimension, filter) {
    //            var selectedRange = ghg2Chart.filter();
    //            console.log(selectedRange);
    //
    //            dimension.filter(function (d) {
    //                var range;
    //                var match = false;
    //                // Iterate over each selected range and return if 'd' is within the range.
    //                for (var i = 0; i < filter.length; i++) {
    //                    range = filter[i];
    //                    console.log(range);
    //                    if (d >= range - .1 && d <= range) {
    //                        match = true;
    //                        console.log("match is true");
    //                        break;
    //                    }
    //                }
    //                return selectedRange != null ? match : true;
    //            });
    //            return filter;
    //        });
    //
    //}());

    //BAR CHART: GHG2
    //(function() {
    //
    //    var GHG2 = sp500.dimension(function (d) {return +d.GHG2;});
    //
    //    console.log("my dimension");
    //    console.log(GHG2);
    //
    //
    //    var minMax = d3.extent(data, function (d) {
    //        return +d.GHG2;
    //    });
    //    var min = minMax[0];
    //    var max = minMax[1];
    //    var binCount = 50;
    //    var span = max - min;
    //
    //    var width = span / binCount;
    //
    //    var GHG2bins = ['Unknown'];
    //
    //    for (var i = 0; i <= binCount; i++) {
    //        GHG2bins.push((Math.floor(width) * i).toString());
    //    }
    //
    //    console.log("my bin")
    //    console.log(GHG2bins);
    //
    //    var mapping = {
    //        "key": "Unknown",
    //        "value": 0
    //    };
    //
    //    var GHG2Group = GHG2.group(function (d) {
    //        if (d == 0) {
    //            return "0"
    //        } else if (d) {
    //            return GHG2bins[Math.ceil((+d * binCount) / max) + 1]; // add two because first two elems are "" and "Unknown"
    //        } else {
    //            console.log("I JUST WANT UNKNOWN VALUES");
    //            return GHG2bins[0];
    //            //mapping["value"] += 1;
    //        }
    //    });
    //
    //    //GHG2Group.add("Unknown", 248);
    //
    //    console.log(GHG2Group.all());
    //
    //    ghg2Chart /* dc.barChart('#volume-month-chart', 'chartGroup') */
    //        .width(FULL_CHART_WIDTH)
    //        .height(FULL_CHART_HEIGHT)
    //        .margins({top: 10, right: 20, bottom: 40, left: 20})
    //        .dimension(GHG2)
    //        .group(GHG2Group)
    //        .centerBar(true)
    //        .elasticY(true)
    //        .gap(5)
    //        .round(dc.round.floor)
    //        .alwaysUseRounding(true)
    //        .x(d3.scale.ordinal().domain(GHG2bins))
    //        .xUnits(dc.units.ordinal)
    //        .renderHorizontalGridLines(true)
    //         //Customize the filter displayed in the control span
    //        .filterHandler(function (dimension, filter) {
    //            var selectedRange = ghg2Chart.filter();
    //            //console.log("what is my selcted range");
    //            //console.log(selectedRange);
    //
    //            dimension.filter(function (d) {
    //                var range;
    //                var match = false;
    //                // Iterate over each selected range and return if 'd' is within the range.
    //                //console.log("what is my filter length");
    //                console.log(filter.length);
    //                for (var i = 0; i < filter.length; i++) {
    //                    range = filter[i];
    //                    //console.log("what is my range in my for loop");
    //                    //console.log(range);
    //                    if (d >= range - width && d <= range + width) {
    //                        match = true;
    //                        //console.log("match is true");
    //                        break;
    //                    }
    //                }
    //                return selectedRange != null ? match : true;
    //            });
    //            return filter;
    //        });
    //}());
    //
    ////BAR CHART: GHG3
    //(function(){
    //    var minMax = d3.extent(data, function (d) {
    //        return +d.GHG3;
    //    });
    //    var min = minMax[0];
    //    var max = minMax[1];
    //    var binCount = 10;
    //    var span = max - min;
    //    var GHG3bins = ['Unknown'];
    //
    //    for (var i = 0; i <= binCount; i++) {
    //        GHG3bins.push((Math.floor(span / binCount) * i).toString());
    //    }
    //
    //    var GHG3Group = GHG3.group(function (d) {
    //        if (typeof d == 'undefined') {
    //            return 'Unknown';
    //        } else {
    //            return GHG3bins[Math.ceil((+d * binCount) / max) + 1]; // add two because first two elems are "" and "Unknown"
    //        }
    //    });
    //
    //    ghg3Chart /* dc.barChart('#volume-month-chart', 'chartGroup') */
    //        .width(FULL_CHART_WIDTH)
    //        .height(FULL_CHART_HEIGHT)
    //        .margins({top: 10, right: 20, bottom: 40, left: 15})
    //        .dimension(GHG3)
    //        .group(GHG3Group)
    //        .elasticY(true)
    //        .centerBar(true)
    //        .gap(5)
    //        // (_optional_) set gap between bars manually in px, `default=2`
    //        // (_optional_) set filter brush rounding
    //        .round(dc.round.floor)
    //        .alwaysUseRounding(true)
    //        .x(d3.scale.ordinal().domain(GHG3bins))
    //        //.x(d3.scale.ordinal().domain(data.map(function (d) {return d.GHG3})))
    //        .xUnits(dc.units.ordinal)
    //        .renderHorizontalGridLines(true)
    //         //Customize the filter displayed in the control span
    //        .filterPrinter(function (filters) {
    //            var filter = filters[0], s = '';
    //            s += numberFormat(filter[0]) + ' -> ' + numberFormat(filter[1]);
    //            return s;
    //        })
    //        .filterHandler(function (dimension, filter) {
    //            var selectedRange = ghg3Chart.filter();
    //            dimension.filter(function (d) {
    //                var range;
    //                var match = false;
    //                // Iterate over each selected range and return if 'd' is within the range.
    //                for (var i = 0; i < filter.length; i++) {
    //                    range = filter[i];
    //                    if (d >= range - .1 && d <= range) {
    //                        match = true;
    //                        break;
    //                    }
    //                }
    //                return selectedRange != null ? match : true;
    //            });
    //            return filter;
    //        });
    //}());

    ////BAR CHART: WATER INTENSITY PER SALES
    //(function() {
    //    var minMax = d3.extent(data, function (d) {
    //        return +d.waterIntensityPersales;
    //    });
    //
    //    var min = minMax[0];
    //    var max = minMax[1];
    //    var binCount = 10;
    //    var span = max - min;
    //
    //    // BINNING
    //    var waterIntensityBins = ['Unknown'];
    //    for (var i = 0; i <= binCount; i++) {
    //        waterIntensityBins.push(((Math.floor(span / binCount) * i)).toString());
    //    }
    //
    //    var waterIntensityGroup = waterIntensityPerSales.group(function (d) {
    //        if (typeof d == 'undefined') {
    //            return 'Unknown';
    //        } else {
    //            return waterIntensityBins[Math.floor((+d * binCount) / max) + 1]; // add two because first two elems are "" and "Unknown"
    //        } //return min + (max - min) * Math.floor(barCount * (d - min) / span) / barCount;
    //    });
    //
    //    waterIntensityPerSalesChart /* dc.barChart('#volume-month-chart', 'chartGroup') */
    //        .width(FULL_CHART_WIDTH)
    //        .height(FULL_CHART_HEIGHT)
    //        .margins({top: 10, right: 20, bottom: 40, left: 40})
    //        .dimension(waterIntensityPerSales)
    //        .group(waterIntensityGroup)
    //        .elasticY(true)
    //        .centerBar(true)    //(function() {
    //
    //    var GHG2 = sp500.dimension(function (d) {return +d.GHG2;});
    //
    //    console.log("my dimension");
    //    console.log(GHG2);
    //
    //
    //    var minMax = d3.extent(data, function (d) {
    //        return +d.GHG2;
    //    });
    //    var min = minMax[0];
    //    var max = minMax[1];
    //    var binCount = 50;
    //    var span = max - min;
    //
    //    var width = span / binCount;
    //
    //    var GHG2bins = ['Unknown'];
    //
    //    for (var i = 0; i <= binCount; i++) {
    //        GHG2bins.push((Math.floor(width) * i).toString());
    //    }
    //
    //    console.log("my bin")
    //    console.log(GHG2bins);
    //
    //    var mapping = {
    //        "key": "Unknown",
    //        "value": 0
    //    };
    //
    //    var GHG2Group = GHG2.group(function (d) {
    //        if (d == 0) {
    //            return "0"
    //        } else if (d) {
    //            return GHG2bins[Math.ceil((+d * binCount) / max) + 1]; // add two because first two elems are "" and "Unknown"
    //        } else {
    //            console.log("I JUST WANT UNKNOWN VALUES");
    //            return GHG2bins[0];
    //            //mapping["value"] += 1;
    //        }
    //    });
    //
    //    //GHG2Group.add("Unknown", 248);
    //
    //    console.log(GHG2Group.all());
    //
    //    ghg2Chart /* dc.barChart('#volume-month-chart', 'chartGroup') */
    //        .width(FULL_CHART_WIDTH)
    //        .height(FULL_CHART_HEIGHT)
    //        .margins({top: 10, right: 20, bottom: 40, left: 20})
    //        .dimension(GHG2)
    //        .group(GHG2Group)
    //        .centerBar(true)
    //        .elasticY(true)
    //        .gap(5)
    //        .round(dc.round.floor)
    //        .alwaysUseRounding(true)
    //        .x(d3.scale.ordinal().domain(GHG2bins))
    //        .xUnits(dc.units.ordinal)
    //        .renderHorizontalGridLines(true)
    //         //Customize the filter displayed in the control span
    //        .filterHandler(function (dimension, filter) {
    //            var selectedRange = ghg2Chart.filter();
    //            //console.log("what is my selcted range");
    //            //console.log(selectedRange);
    //
    //            dimension.filter(function (d) {
    //                var range;
    //                var match = false;
    //                // Iterate over each selected range and return if 'd' is within the range.
    //                //console.log("what is my filter length");
    //                console.log(filter.length);
    //                for (var i = 0; i < filter.length; i++) {
    //                    range = filter[i];
    //                    //console.log("what is my range in my for loop");
    //                    //console.log(range);
    //                    if (d >= range - width && d <= range + width) {
    //                        match = true;
    //                        //console.log("match is true");
    //                        break;
    //                    }
    //                }
    //                return selectedRange != null ? match : true;
    //            });
    //            return filter;
    //        });
    //}());
    //
    ////BAR CHART: GHG3
    //(function(){
    //    var minMax = d3.extent(data, function (d) {
    //        return +d.GHG3;
    //    });
    //    var min = minMax[0];
    //    var max = minMax[1];
    //    var binCount = 10;
    //    var span = max - min;
    //    var GHG3bins = ['Unknown'];
    //
    //    for (var i = 0; i <= binCount; i++) {
    //        GHG3bins.push((Math.floor(span / binCount) * i).toString());
    //    }
    //
    //    var GHG3Group = GHG3.group(function (d) {
    //        if (typeof d == 'undefined') {
    //            return 'Unknown';
    //        } else {
    //            return GHG3bins[Math.ceil((+d * binCount) / max) + 1]; // add two because first two elems are "" and "Unknown"
    //        }
    //    });
    //
    //    ghg3Chart /* dc.barChart('#volume-month-chart', 'chartGroup') */
    //        .width(FULL_CHART_WIDTH)
    //        .height(FULL_CHART_HEIGHT)
    //        .margins({top: 10, right: 20, bottom: 40, left: 15})
    //        .dimension(GHG3)
    //        .group(GHG3Group)
    //        .elasticY(true)
    //        .centerBar(true)
    //        .gap(5)
    //        // (_optional_) set gap between bars manually in px, `default=2`
    //        // (_optional_) set filter brush rounding
    //        .round(dc.round.floor)
    //        .alwaysUseRounding(true)
    //        .x(d3.scale.ordinal().domain(GHG3bins))
    //        //.x(d3.scale.ordinal().domain(data.map(function (d) {return d.GHG3})))
    //        .xUnits(dc.units.ordinal)
    //        .renderHorizontalGridLines(true)
    //         //Customize the filter displayed in the control span
    //        .filterPrinter(function (filters) {
    //            var filter = filters[0], s = '';
    //            s += numberFormat(filter[0]) + ' -> ' + numberFormat(filter[1]);
    //            return s;
    //        })
    //        .filterHandler(function (dimension, filter) {
    //            var selectedRange = ghg3Chart.filter();
    //            dimension.filter(function (d) {
    //                var range;
    //                var match = false;
    //                // Iterate over each selected range and return if 'd' is within the range.
    //                for (var i = 0; i < filter.length; i++) {
    //                    range = filter[i];
    //                    if (d >= range - .1 && d <= range) {
    //                        match = true;
    //                        break;
    //                    }
    //                }
    //                return selectedRange != null ? match : true;
    //            });
    //            return filter;
    //        });
    //}());

    //        .gap(5)
    //        .round(dc.round.floor)
    //        .alwaysUseRounding(true)
    //        .x(d3.scale.ordinal().domain(waterIntensityBins))
    //        .xUnits(dc.units.ordinal)
    //        .renderHorizontalGridLines(true)
    //        .filterPrinter(function (filters) {
    //            var filter = filters[0], s = '';
    //            s += numberFormat(filter[0]) + ' -> ' + numberFormat(filter[1]);
    //            return s;
    //        })
    //        //.filterHandler(function (dimension, filter) {
    //        //    var selectedRange = waterIntensityPerSalesChart.filter();
    //        //    dimension.filter(function (d) {
    //        //        var range;
    //        //        var match = false;
    //        //        // Iterate over each selected range and return if 'd' is within the range.
    //        //        for (var i = 0; i < filter.length; i++) {
    //        //            range = filter[i];
    //        //            if (d >= range - .1 && d <= range) {
    //        //                match = true;
    //        //                break;
    //        //            }
    //        //        }
    //        //        return selectedRange != null ? match : true;
    //        //    });
    //        //    return filter;
    //        //});
    //}());
    //
    ////BAR CHART: WATER WITHDRAWL
    //(function() {
    //
    //    var minMax = d3.extent(data, function (d) {
    //        return +d.totalWaterWithdrawl;
    //    });
    //
    //    var min = minMax[0];
    //    var max = minMax[1];
    //    var binCount = 10;
    //    var span = max - min;
    //
    //    var tWWbins = ['Unknown'];
    //
    //    for (var i = 0; i <= binCount; i++) {
    //        tWWbins.push(((Math.floor(span / binCount) * i)).toString());
    //    }
    //
    //    var tWWGroup = totalWaterWithdrawl.group(function (d) {
    //        if (typeof d == 'undefined') {
    //            return 'Unknown';
    //        } else {
    //            return tWWbins[Math.floor((+d * binCount) / max) + 1]; // add two because first two elems are "" and "Unknown"
    //        } //return min + (max - min) * Math.floor(barCount * (d - min) / span) / barCount;
    //    });
    //
    //    totalWaterWithdrawlChart /* dc.barChart('#volume-month-chart', 'chartGroup') */
    //        .width(FULL_CHART_WIDTH)
    //        .height(FULL_CHART_HEIGHT)
    //        .margins({top: 10, right: 20, bottom: 50, left: 40})
    //        .dimension(totalWaterWithdrawl)
    //        .group(tWWGroup)
    //        .elasticY(true)
    //        .centerBar(true)
    //        .gap(5)
    //        .round(dc.round.floor)
    //        .alwaysUseRounding(true)
    //        .x(d3.scale.ordinal().domain(tWWbins))
    //        .xUnits(dc.units.ordinal)
    //        .renderHorizontalGridLines(true)
    //        .filterPrinter(function (filters) {
    //            var filter = filters[0], s = '';
    //            s += numberFormat(filter[0]) + ' -> ' + numberFormat(filter[1]);
    //            return s;
    //        })
    //        //.filterHandler(function (dimension, filter) {
    //        //    var selectedRange = totalWaterWithdrawlChart.filter();
    //        //    dimension.filter(function (d) {
    //        //        var range;
    //        //        var match = false;
    //        //        // Iterate over each selected range and return if 'd' is within the range.
    //        //        for (var i = 0; i < filter.length; i++) {
    //        //            range = filter[i];
    //        //            if (d >= range - .1 && d <= range) {
    //        //                match = true;
    //        //                break;
    //        //            }
    //        //        }
    //        //        return selectedRange != null ? match : true;
    //        //    });
    //        //    return filter;
    //        //});
    //}());
    //
    ////BAR CHART: WATER DISCHARGED
    //(function() {
    //    var minMax = d3.extent(data, function (d) {
    //        return +d.totalWaterDischarged;
    //    });
    //
    //    var min = minMax[0];
    //    var max = minMax[1];
    //    var binCount = 10;
    //    var span = max - min;
    //
    //    var tWDbins = ['Unknown'];
    //
    //    for (var i = 0; i <= binCount; i++) {
    //        tWDbins.push(((Math.floor(span / binCount) * i)).toString());
    //    }
    //
    //    var totalWaterDischargedGroup = totalWaterDischarged.group(function (d) {
    //        if (typeof d == 'undefined') {
    //            return 'Unknown';
    //        } else {
    //            return tWDbins[Math.floor((+d * binCount) / max) + 1]; // add two because first two elems are "" and "Unknown"
    //        }
    //    });
    //
    //    totalWaterDischargedChart /* dc.barChart('#volume-month-chart', 'chartGroup') */
    //        .width(FULL_CHART_WIDTH)
    //        .height(FULL_CHART_HEIGHT)
    //        .margins({top: 10, right: 20, bottom: 50, left: 40})
    //        .dimension(totalWaterDischarged)
    //        .group(totalWaterDischargedGroup)
    //        .elasticY(true)
    //        .centerBar(true)
    //        .gap(5)
    //        .round(dc.round.floor)
    //        .alwaysUseRounding(true)
    //        .x(d3.scale.ordinal().domain(tWDbins))
    //        .xUnits(dc.units.ordinal)
    //        .renderHorizontalGridLines(true)
    //        .filterPrinter(function (filters) {
    //            var filter = filters[0], s = '';
    //            s += numberFormat(filter[0]) + ' -> ' + numberFormat(filter[1]);
    //            return s;
    //        })
    //        //.filterHandler(function (dimension, filter) {
    //        //    var selectedRange = totalWaterDischargedChart.filter();
    //        //    dimension.filter(function (d) {
    //        //        var range;
    //        //        var match = false;
    //        //        // Iterate over each selected range and return if 'd' is within the range.
    //        //        for (var i = 0; i < filter.length; i++) {
    //        //            range = filter[i];
    //        //            if (d >= range - .1 && d <= range) {
    //        //                match = true;
    //        //                break;
    //        //            }
    //        //        }
    //        //        return selectedRange != null ? match : true;
    //        //    });
    //        //    return filter;
    //        //});
    //}());
    //
    ////BAR CHART: WASTE INTENSITY PER SALES
    //(function() {
    //
    //    var minMax = d3.extent(data, function (d) {
    //        return +d.wasteIntensityPerSales;
    //    });
    //
    //    var min = minMax[0];
    //    var max = minMax[1];
    //    var binCount = 10;
    //    var span = max - min;
    //
    //    var wasteIntensityBins = ['Unknown'];
    //    for (var i = 0; i <= binCount; i++) {
    //        wasteIntensityBins.push(((Math.floor(span / binCount) * i)).toString());
    //    }
    //
    //    var wasteIntensityGroup = wasteIntensityPerSales.group(function (d) {
    //        if (typeof d == 'undefined') {
    //            return 'Unknown';
    //        } else {
    //            return wasteIntensityBins[Math.floor((+d * binCount) / max) + 1]; // add two because first two elems are "" and "Unknown"
    //        }
    //    });
    //
    //    wasteIntensityPerSalesChart /* dc.barChart('#volume-month-chart', 'chartGroup') */
    //        .width(FULL_CHART_WIDTH)
    //        .height(FULL_CHART_HEIGHT)
    //        .margins({top: 10, right: 20, bottom: 40, left: 40})
    //        .dimension(wasteIntensityPerSales)
    //        .group(wasteIntensityGroup)
    //        .elasticY(true)
    //        .centerBar(true)
    //        .gap(5)
    //        .round(dc.round.floor)
    //        .alwaysUseRounding(true)
    //        .x(d3.scale.ordinal().domain(wasteIntensityBins))
    //        .xUnits(dc.units.ordinal)
    //        .renderHorizontalGridLines(true)
    //        .filterPrinter(function (filters) {
    //            var filter = filters[0], s = '';
    //            s += numberFormat(filter[0]) + ' -> ' + numberFormat(filter[1]);
    //            return s;
    //        })
    //        //.filterHandler(function (dimension, filter) {
    //        //    var selectedRange = wasteIntensityPerSalesChart.filter();
    //        //    dimension.filter(function (d) {
    //        //        var range;
    //        //        var match = false;
    //        //        // Iterate over each selected range and return if 'd' is within the range.
    //        //        for (var i = 0; i < filter.length; i++) {
    //        //            range = filter[i];
    //        //            if (d >= range - .1 && d <= range) {
    //        //                match = true;
    //        //                break;
    //        //            }
    //        //        }
    //        //        return selectedRange != null ? match : true;
    //        //    });
    //        //    return filter;
    //        //});
    //}());
    //
    ////BAR CHART: WASTE SENT TO LANDFILL
    //(function() {
    //
    //    var minMax = d3.extent(data, function (d) {
    //        return +d.wasteSentToLandfill;
    //    });
    //
    //    var min = minMax[0];
    //    var max = minMax[1];
    //    var binCount = 10;
    //    var span = max - min;
    //
    //    // BINNING
    //    var bins = ['Unknown'];
    //    for (var i = 0; i <= binCount; i++) {
    //        bins.push(((Math.floor(span / binCount) * i)).toString());
    //    }
    //
    //    var wasteIntensityGroup = wasteSentToLandfill.group(function (d) {
    //        if (typeof d == 'undefined') {
    //            return 'Unknown';
    //        } else {
    //            return bins[Math.floor((+d * binCount) / max) + 1]; // add two because first two elems are "" and "Unknown"
    //        } //return min + (max - min) * Math.floor(barCount * (d - min) / span) / barCount;
    //    });
    //
    //    wasteSentToLandfillChart /* dc.barChart('#volume-month-chart', 'chartGroup') */
    //        .width(FULL_CHART_WIDTH)
    //        .height(FULL_CHART_HEIGHT)
    //        .margins({top: 10, right: 20, bottom: 40, left: 40})
    //        .dimension(wasteSentToLandfill)
    //        .group(wasteIntensityGroup)
    //        .elasticY(true)
    //        .centerBar(true)
    //        .gap(5)
    //        .round(dc.round.floor)
    //        .alwaysUseRounding(true)
    //        .x(d3.scale.ordinal().domain(bins))
    //        .xUnits(dc.units.ordinal)
    //        .renderHorizontalGridLines(true)
    //        .filterPrinter(function (filters) {
    //            var filter = filters[0], s = '';
    //            s += numberFormat(filter[0]) + ' -> ' + numberFormat(filter[1]);
    //            return s;
    //        })
    //        //.filterHandler(function (dimension, filter) {
    //        //    var selectedRange = wasteSentToLandfillChart.filter();
    //        //    dimension.filter(function (d) {
    //        //        var range;
    //        //        var match = false;
    //        //        // Iterate over each selected range and return if 'd' is within the range.
    //        //        for (var i = 0; i < filter.length; i++) {
    //        //            range = filter[i];
    //        //            if (d >= range - .1 && d <= range) {
    //        //                match = true;
    //        //                break;
    //        //            }
    //        //        }
    //        //        return selectedRange != null ? match : true;
    //        //    });
    //        //    return filter;
    //        //});
    //}());
    //
    ////BAR CHART: WASTE GENERATED PER ASSETS
    //(function() {
    //
    //    var minMax = d3.extent(data, function (d) {
    //        return +d.wasteGeneratedPerAssets;
    //    });
    //
    //    var min = minMax[0];
    //    var max = minMax[1];
    //    var binCount = 10;
    //    var span = max - min;
    //
    //    // BINNING
    //    var bins = ['Unknown'];
    //    for (var i = 0; i <= binCount; i++) {
    //        bins.push(((Math.floor(span / binCount) * i)).toString());
    //    }
    //
    //    var wgGroup = wasteGeneratedPerAssets.group(function (d) {
    //        if (typeof d == 'undefined') {
    //            return 'Unknown';
    //        } else {
    //            return bins[Math.floor((+d * binCount) / max) + 1]; // add two because first two elems are "" and "Unknown"
    //        } //return min + (max - min) * Math.floor(barCount * (d - min) / span) / barCount;
    //    });
    //
    //    wasteGeneratedPerAssetsChart /* dc.barChart('#volume-month-chart', 'chartGroup') */
    //        .width(FULL_CHART_WIDTH)
    //        .height(FULL_CHART_HEIGHT)
    //        .margins({top: 10, right: 20, bottom: 40, left: 40})
    //        .dimension(wasteGeneratedPerAssets)
    //        .group(wgGroup)
    //        .elasticY(true)
    //        .centerBar(true)
    //        .gap(5)
    //        .round(dc.round.floor)
    //        .alwaysUseRounding(true)
    //        .x(d3.scale.ordinal().domain(bins))
    //        .xUnits(dc.units.ordinal)
    //        .renderHorizontalGridLines(true)
    //        .filterPrinter(function (filters) {
    //            var filter = filters[0], s = '';
    //            s += numberFormat(filter[0]) + ' -> ' + numberFormat(filter[1]);
    //            return s;
    //        })
    //        //.filterHandler(function (dimension, filter) {
    //        //    var selectedRange = wasteGeneratedPerAssetsChart.filter();
    //        //    dimension.filter(function (d) {
    //        //        var range;
    //        //        var match = false;
    //        //        // Iterate over each selected range and return if 'd' is within the range.
    //        //        for (var i = 0; i < filter.length; i++) {
    //        //            range = filter[i];
    //        //            if (d >= range - .1 && d <= range) {
    //        //                match = true;
    //        //                break;
    //        //            }
    //        //        }
    //        //        return selectedRange != null ? match : true;
    //        //    });
    //        //    return filter;
    //        //});
    //}());
    //
    ////BAR CHART: ENERGY INTENSITY PER SALES
    //(function() {
    //
    //    var minMax = d3.extent(data, function (d) {
    //        return +d.energyIntensityPerSales;
    //    });
    //
    //    var min = minMax[0];
    //    var max = minMax[1];
    //    var binCount = 10;
    //    var span = max - min;
    //
    //    // BINNING
    //    var bins = ['Unknown'];
    //    for (var i = 0; i <= binCount; i++) {
    //        bins.push(((Math.floor(span / binCount) * i)).toString());
    //    }
    //
    //    var group = energyIntensityPerSales.group(function (d) {
    //        if (typeof d == 'undefined') {
    //            return 'Unknown';
    //        } else {
    //            return bins[Math.floor((+d * binCount) / max) + 1]; // add two because first two elems are "" and "Unknown"
    //        } //return min + (max - min) * Math.floor(barCount * (d - min) / span) / barCount;
    //    });
    //
    //    energyIntensityPerSalesChart /* dc.barChart('#volume-month-chart', 'chartGroup') */
    //        .width(FULL_CHART_WIDTH)
    //        .height(FULL_CHART_HEIGHT)
    //        .margins({top: 10, right: 20, bottom: 40, left: 40})
    //        .dimension(energyIntensityPerSales)
    //        .group(group)
    //        .elasticY(true)
    //        .centerBar(true)
    //        .gap(5)
    //        .round(dc.round.floor)
    //        .alwaysUseRounding(true)
    //        .x(d3.scale.ordinal().domain(bins))
    //        .xUnits(dc.units.ordinal)
    //        .renderHorizontalGridLines(true)
    //        .filterPrinter(function (filters) {
    //            var filter = filters[0], s = '';
    //            s += numberFormat(filter[0]) + ' -> ' + numberFormat(filter[1]);
    //            return s;
    //        })
    //        //.filterHandler(function (dimension, filter) {
    //        //    var selectedRange = energyIntensityPerSalesChart.filter();
    //        //    dimension.filter(function (d) {
    //        //        var range;
    //        //        var match = false;
    //        //        // Iterate over each selected range and return if 'd' is within the range.
    //        //        for (var i = 0; i < filter.length; i++) {
    //        //            range = filter[i];
    //        //            if (d >= range - .1 && d <= range) {
    //        //                match = true;
    //        //                break;
    //        //            }
    //        //        }
    //        //        return selectedRange != null ? match : true;
    //        //    });
    //        //    return filter;
    //        //});
    //}());
    //
    ////Pie Chart: RISK EXPOSED
    //(function() {
    //    // Produce counts records in the dimension
    //    var riskExpGroup = riskExp.group();
    //
    //    riskExposedChart /* dc.pieChart('#gain-loss-chart', 'chartGroup') */ // (_optional_) define chart width, `default = 200`
    //        .width(150)// (optional) define chart height, `default = 200`
    //        .height(150)// Define pie radius
    //        .radius(75)// Set dimension
    //        .dimension(riskExp)// Set group
    //        .group(riskExpGroup)// (_optional_) by default pie chart will use `group.key` as its label but you can overwrite it with a closure.
    //        .label(function (d) {
    //            if (riskExposedChart.hasFilter() && !riskExposedChart.hasFilter(d.key)) {
    //                return d.key + '(0%)';
    //            }
    //            var label = d.key;
    //            if (all.value()) {
    //                label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
    //            }
    //            return label;
    //        });
    //}());
    //
    ////Pie Chart: CC policy implemented?
    //(function() {
    //    // Produce counts records in the dimension
    //    var ccImplementedGroup = ccImplemented.group();
    //
    //    ccPolicyImplChart
    //        .width(150)// (optional) define chart height, `default = 200`
    //        .height(150)// Define pie radius
    //        .radius(75)// Set dimension
    //        .dimension(ccImplemented)
    //        .group(ccImplementedGroup)
    //        .label(function (d) {
    //            if (ccPolicyImplChart.hasFilter() && !ccPolicyImplChart.hasFilter(d.key)) {
    //                return d.key + '(0%)';
    //            }
    //            var label = d.key;
    //            if (all.value()) {
    //                label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
    //            }
    //            return label;
    //        });
    //
    //}());
    //

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

    rotateLabels();

});

function rotateLabels() {
    d3.selectAll(".axis.x").selectAll(".tick text").style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "translate(30,0) rotate(-65)"
        });
}

//#### Versions

//Determine the current version of dc with `dc.version`
d3.selectAll('#version').text(dc.version);

// Determine latest stable version in the repo via Github API
d3.json('https://api.github.com/repos/dc-js/dc.js/releases/latest', function (error, latestRelease) {
    /*jshint camelcase: false */
    d3.selectAll('#latest').text(latestRelease.tag_name); /* jscs:disable */
});

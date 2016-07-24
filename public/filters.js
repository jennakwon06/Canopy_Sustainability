console.log("loading global var file");

var globalFilter; // filter maintained on name field
var globalData; // holds all data objects

var companiesCount = dc.dataCount('.companiesCount');
var industryChart = dc.scrollableRowChart('#industry_chart');
var sectorChart = dc.scrollableRowChart('#sector_chart');
var ghg1Chart = dc.barChart('#ghg1Chart'); // EMISSIONS
var ghg2Chart = dc.barChart('#ghg2Chart');
var ghg3Chart = dc.barChart('#ghg3Chart');
var totalWaterUseChart = dc.barChart('#totalWaterUseChart'); //WATER
var totalWaterWithdrawlChart = dc.barChart('#totalWaterWithdrawlChart');
var totalWaterDischargedChart = dc.barChart('#totalWaterDischargedChart');
var totalWasteChart = dc.barChart("#totalWasteChart"); //WASTE
var wasteRecycledChart = dc.barChart("#wasteRecycledChart");
var wasteSentToLandfillChart = dc.barChart("#wasteSentToLandfillChart");
var totalEnergyConsumptionChart = dc.barChart("#totalEnergyConsumptionChart"); //ENERGY
var ccPolicyImplRowChart2 = dc.stackedRowChart('#ccPolicyImplRowChart2'); //BINAR YBARS

var fields = ["ghg1", "ghg2", "ghg3"
    , "totalWaterUse", "totalWaterWithdrawl", "totalWaterDischarged"
    , "totalWaste", "wasteRecycled", "wasteSentToLandfill"
    , "totalEnergyConsumption", "price", "revenue" ];

var fieldsFilters = ["ghg1", "ghg2", "ghg3"
    , "totalWaterUse", "totalWaterWithdrawl", "totalWaterDischarged"
    , "totalWaste", "wasteRecycled", "wasteSentToLandfill"
    , "totalEnergyConsumption"];

var fieldUnits = {
    "ghg1" : "(1000MT)",
    "ghg2" : "(1000MT)",
    "ghg3" : "(1000MT)",
    "totalWaterUse": "(1000m³)",
    "totalWaterWithdrawl" : "(1000m³)",
    "totalWaterDischarged" : "(1000m³)",
    "totalWaste" : "(1000MT)",
    "wasteRecycled" : "(1000MT)",
    "wasteSentToLandfill" : "(1000MT)",
    "totalEnergyConsumption" : "(1000MWh)",
    "revenue": "($)",
    "price": "($)"
};

var color = d3.scale.linear()
    .range(["green", "red"])
    .interpolate(d3.interpolateHsl);

d3.csv('/data/master.csv', function (data) {
    globalData = [];

    console.log("loading filters var file");

    // Preprocess raw data field headers and store them
    data.forEach(function (d) {

        var obj = {};

        // metadata
        obj.name = d.name;
        obj.address = d.address;
        obj.latitute = d.latitude;
        obj.longitude = d.longitude;

        //Revenue T12M, Price
        obj.revenue = d["Revenue T12M"];
        obj.price = d["Price"];

        obj.country = d["Registered Country Location"];
        obj.industry = d["ICB Industry Name"];
        obj.sector = d["ICB Sector Name"];
        obj.isin = d["ISIN"];
        obj.ticker = d["Ticker"];
        obj.URL = d["URL"];

        // @TODO implement binary selectors
        //Climate Chg Pol:Y,Equal Opp Pol:Y,Water Policy,Human Rights Pol:Y, Energy Effic Pol:Y,Bus Ethics Pol:Y,Biodiv Pol:Y,
        obj.ccImplemented = d["Climate Chg Pol:Y"];
        obj.equalOpp = d["Equal Opp Pol:Y"];
        obj.waterPolicy = d["Water Policy"];


        // Total Water Withdrawal Tot Wtr Dschgd:Y Tot Wtr Use:Y
        obj.totalWaterUse = d["Tot Wtr Use:Y"]; // total water use * 1,000,000 / sales, ESO16
        obj.totalWaterWithdrawl = d["Total Water Withdrawal"]; // thousands of cubic meters
        obj.totalWaterDischarged = d["Tot Wtr Dschgd:Y"]; // thousands of cubic meters

        //Waste Recycl:Y,Total Waste:Y,Wste Sent to Ldflls:Y
        obj.totalWaste = d["Total Waste:Y"];         //Total waste is ESO20
        obj.wasteSentToLandfill = d["Wste Sent to Ldflls:Y"]; //thousands of metric tons
        obj.wasteRecycled = d["Waste Recycl:Y"]; //total waste / total assets

        // Energy Consump:Y
        obj.totalEnergyConsumption = d["Energy Consump:Y"]; //  ESO14 : thousands of megawatt hours

        //GHG Scope 3:Y,GHG Scope 2:Y,GHG Scope 1:Y
        obj.ghg3 = d["GHG Scope 3:Y"];
        obj.ghg2 = d["GHG Scope 2:Y"];
        obj.ghg1 = d["GHG Scope 1:Y"];

        obj.numReports = d["# Available Reports"];

        globalData.push(obj);
    });

    for (var i = 0; i < globalData.length; i++) {
        var maxValues = [];
        for (var j = 0; i < fieldsFilters.length; j++) {
            maxValues.push(d3.extent(globalData, function (d) {
                return +d[fieldsFilters[j]];
            })[1]);
        }

        console.log(maxValues);

        // calculate initial index
        var curScore = 0;
        var counter = 0;
        var arr = [];
        for (j = 0; i < fieldsFilters.length; j++) {
            if (+globalData[i][fieldsFilters[j]]) {
                counter++;
                var temp = {
                    name: "",
                    value: 0
                };
                temp.name = fieldsFilters[j];
                temp.weight = document.getElementById(fieldsFilters[j] + "Weight").value;
                temp.value = +globalData[i][fieldsFilters[j]];
                arr.push(temp);
                var score = Math.log(globalData[i][fieldsFilters[j]]) / Math.log(maxValues[j]);
                score = score > 0 ? score : 0;
                curScore += score;
            }
        }

        globalData[i].dataInfo = arr;
        globalData[i].sustIndex = curScore / counter; // AVERAGING
        globalData[i].color = color(globalData[i].sustIndex);
    }
    
    // Chart
    var FULL_CHART_WIDTH = $(".filter_container").width() - 30;
    var HALF_CHART_WIDTH = ($(".filter_container").width() - 30) / 2;
    var HALF_CHART_HEIGHT = 60;

    //### Create Crossfilter Dimensions and Groups. NOTE: BE CAREFUL OF HOW MANY DIMENSIONS YOU INSTANTIATE
    var sp500 = crossfilter(globalData);
    var all = sp500.groupAll();

    // GENERAL
    globalFilter = sp500.dimension(function (d) {return d.name;});

    if (!jQuery.isFunction(fillTable)) {
        $.getScript("/globalFunctions.js");
    }

    fillTable(globalFilter.top(Infinity).reverse());
    fillRawDataTable(globalFilter.top(Infinity).reverse());
    drawScatterPlot(globalFilter.top(Infinity), selectedX, selectedY);
    drawGradientBar();
    drawMap(globalFilter.top(Infinity));

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

    //@TODO binary selectors
    //var riskExp = sp500.dimension(function (d) {return d.riskExp == "1" ? 'Yes' : 'No';});
    var ccImplemented = sp500.dimension(function (d) {return +d.ccImplemented == 1 ? 'Yes' : 'No';});
    //var WasteReductionPolicy = sp500.dimension(function (d) {return d.wasteReductionPolicy == "1" ? 'Yes' : 'No';});

    companiesCount
        .dimension(sp500)
        .group(all)
        .html({
            some: '<strong>%filter-count</strong> / <strong>%total-count</strong>',
            all: '<strong>%total-count</strong>'
        });

    var tooltipDiv = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
    var fieldMetadata = {
        "sector": "sector info",
        "industry": "industry info",
        "ghg1": "Scope 1/Direct Greenhouse Gas (GHG) Emissions of the company, in thousands of metric tons. " +
        "GHG are defined as those gases which contribute to the trapping of heat in the Earth's atmosphere and they include Carbon Dioxide (CO2), Methane, and Nitrous Oxide. " +
        "Scope 1 Emissions are those emitted from sources that are owned or controlled by the reporting entity. " +
        "Examples of Direct Emissions include emissions from combustion in owned or controlled boilers, furnaces, vehicles, emissions from chemical production in owned or controlled process equipment. " +
        "Emissions reported as CO2 only will NOT be captured in this field. Emissions reported as generic GHG emissions or CO2 equivalents (CO2e) will be captured in this field. ",
        "ghg2": "Scope 2/Indirect Greenhouse Gas (GHG) Emissions of the company in thousands of metric tons. " +
        "Greenhouse Gases are defined as those gases which contribute to the trapping of heat in the Earth's atmosphere and they include Carbon Dioxide (CO2), Methane, and Nitrous Oxide. " +
        "Scope 2 Emissions are those emitted that are a consequence of the activities of the reporting entity, but occur at sources owned or controlled by another entity. " +
        "The principle source of Indirect Emissions is emissions from purchased electricity, steam and/or heating/cooling. " +
        "These emissions physically occur at the facility where electricity/steam/heating/cooling is generated. " +
        "Emissions reported as CO2 only will NOT be captured in this field. " +
        "Emissions reported as generic GHG emissions or CO2 equivalents (CO2e) will be captured in this field. ",
        "ghg3": "Scope 3 Greenhouse Gas (GHG) Emissions of the company, in thousands of metric ton. " +
        "Greenhouse Gases are defined as those gases which contribute to the trapping of heat in the Earth's atmosphere and they include Carbon Dioxide (CO2), Methane, and Nitrous Oxide. " +
        "Scope 3 emissions are all non-scope 2, indirect emissions, such as the extraction and production of purchased materials and fuels, " +
        "transport-related activities in vehicles not owned or controlled by the reporting entity, electricity-related activities" +
        " (e.g. Transmission & Distribution losses) not covered in Scope 2, outsourced activities, waste disposal, etc. " +
        "Emissions reported as CO2 only will NOT be captured in this field. " +
        "Emissions reported as generic GHG emissions or CO2 equivalents (CO2e) will be captured in this field. ",
        "totalWaterUse": "Total amount of water used to support a company's operational processes, in thousands of cubic meters. " +
        "The sum of all water withdrawls for process water and cooling water and all water retained by company facilities through recycling.",
        "totalWaterWithdrawl": "Unavailable",
        "totalWaterDischarged": "Total volume of liquid waste and process water discharged by the corporation, in thousands of cubic meters. " +
        "Includes treated and untreated effluents returned toa ny water source. " +
        "The volume of cooling water discharged is specifically reported as the field coolinG water outflow.",
        "totalWaste": "Total amount of waste the company discards, both hazardous and non-hazardous, in thousands of metric tons. ",
        "wasteRecycled": "Total amount of waste the company recycles, in thousands of metric tons. ",
        "wasteSentToLandfill": "Amount of company waste sent to landfills, in thousands of metric tons",
        "totalEnergyConsumption": "Total Energy Consumption Figure in thousands of megawatt hours (MWh). " +
        "This field might include energy directly consumed through combustion in owned or controlled boilers, furnaces, vehicles, or through chemical production in owned or controlled process equipment. " +
        "It also includes energy consumed as electricity. " +
        "Field is part of the Environmental, Social and Governance (ESG) group of fields."
    };

    // attach tooltips on all filter graphs
    d3.select("#filterBar")
        .selectAll("strong")
        .on("mouseover", function (d) {

            var text = fieldMetadata[$(this).attr("id")];
            tooltipDiv.transition()
                .duration(200)
                .style("opacity", .9)
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            tooltipDiv.html(text);
        })
        .on("mouseout", function (d) {
            tooltipDiv.transition()
                .duration(500)
                .style("opacity", 0);
        });


    //ROW CHART: INDUSTRY CHART
    (function () {
        var industryGroup = industry.group();

        industryChart /* dc.rowChart('#day-of-week-chart', 'chartGroup') */
            .chartId("industry")
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
    (function () {
        var sectorGroup = sector.group();

        sectorChart /* dc.rowChart('#day-of-week-chart', 'chartGroup') */
            .chartId("sector")
            .width(FULL_CHART_WIDTH)
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

    (function () {
        var binCount = 100;
        var minMax = d3.extent(data, function (d) {
            return +d.ghg1;
        });
        var min = minMax[0];
        var max = minMax[1];
        var binWidth = (max - min) / binCount;

        var ghg1Group = ghg1.group().reduce(reduceAdd, reduceRemove, reduceInitial);

        ghg1Chart
            .chartId("ghg1")
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
    (function () {
        var binCount = 100;
        var minMax = d3.extent(data, function (d) {
            return +d.ghg2;
        });
        var min = minMax[0];
        var max = minMax[1];
        var binWidth = (max - min) / binCount;
        var ghg2Group = ghg2.group().reduce(reduceAdd, reduceRemove, reduceInitial);

        ghg2Chart
            .chartId("ghg2")
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
    (function () {
        var binCount = 100;
        var minMax = d3.extent(data, function (d) {
            return +d.ghg3;
        });
        var min = minMax[0];
        var max = minMax[1];
        var binWidth = (max - min) / binCount;
        var ghg3Group = ghg3.group().reduce(reduceAdd, reduceRemove, reduceInitial);

        ghg3Chart
            .chartId("ghg3")
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
    (function () {
        var binCount = 100;
        var minMax = d3.extent(data, function (d) {
            return +d.totalWaterUse;
        });
        var min = minMax[0];
        var max = minMax[1];
        var binWidth = (max - min) / binCount;
        var waterIntensityGroup = totalWaterUse.group().reduce(reduceAdd, reduceRemove, reduceInitial);

        totalWaterUseChart
            .chartId("totalWaterUse")
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
    (function () {
        var binCount = 100;
        var minMax = d3.extent(data, function (d) {
            return +d.totalWaterWithdrawl;
        });
        var min = minMax[0];
        var max = minMax[1];
        var binWidth = (max - min) / binCount;
        var tWWGroup = totalWaterWithdrawl.group().reduce(reduceAdd, reduceRemove, reduceInitial);

        totalWaterWithdrawlChart
            .chartId("totalWaterWithdrawl")
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
    (function () {
        var binCount = 100;
        var minMax = d3.extent(data, function (d) {
            return +d.totalWaterDischarged;
        });
        var min = minMax[0];
        var max = minMax[1];
        var binWidth = (max - min) / binCount;
        var totalWaterDischargedGroup = totalWaterDischarged.group().reduce(reduceAdd, reduceRemove, reduceInitial);

        totalWaterDischargedChart
            .chartId("totalWaterDischarged")
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
    (function () {
        var binCount = 100;
        var minMax = d3.extent(data, function (d) {
            return +d.totalWaste;
        });
        var min = minMax[0];
        var max = minMax[1];
        var binWidth = (max - min) / binCount;
        var wasteIntensityGroup = totalWaste.group().reduce(reduceAdd, reduceRemove, reduceInitial);

        totalWasteChart
            .chartId("totalWaste")
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
    (function () {
        var binCount = 100;
        var minMax = d3.extent(data, function (d) {
            return +d.wasteSentToLandfill;
        });
        var min = minMax[0];
        var max = minMax[1];
        var binWidth = (max - min) / binCount;
        var wasteSentToLandFillGroup = wasteSentToLandfill.group().reduce(reduceAdd, reduceRemove, reduceInitial);

        wasteSentToLandfillChart
            .chartId("wasteSentToLandfill")
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
    (function () {
        var binCount = 100;
        var minMax = d3.extent(data, function (d) {
            return +d.wasteRecycled;
        });
        var min = minMax[0];
        var max = minMax[1];
        var binWidth = (max - min) / binCount;
        var wgGroup = wasteRecycled.group().reduce(reduceAdd, reduceRemove, reduceInitial);

        wasteRecycledChart
            .chartId("wasteRecycled")
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
    (function () {
        var binCount = 100;
        var minMax = d3.extent(data, function (d) {
            return +d.totalEnergyConsumption;
        });
        var min = minMax[0];
        var max = minMax[1];
        var binWidth = (max - min) / binCount;
        var group = totalEnergyConsumption.group().reduce(reduceAdd, reduceRemove, reduceInitial);

        totalEnergyConsumptionChart
            .chartId("totalEnergyConsumption")
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


    (function() {
        // Produce counts records in the dimension
        var ccImplementedGroup = ccImplemented.group();

        //reply to http://stackoverflow.com/questions/29360042/how-to-create-stacked-row-chart-with-one-row-with-dc-js
        //reply to http://stackoverflow.com/questions/29360042/how-to-create-stacked-row-chart-with-one-row-with-dc-js

        var binaryColors = ["red", "blue"];

        ccPolicyImplRowChart2
            .chartId("ccPolicy")
            .width(FULL_CHART_WIDTH)
            .height(HALF_CHART_HEIGHT)
            .margins({top: 0, left: 0, right: 0, bottom: 20})
            .group(ccImplementedGroup)
            //.group(ccImplementedGroup, "1", sel_stack('1'))
            .dimension(ccImplemented)
            .ordinalColors(['#3C8D2F', '#3C8D2F'])
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

        //function sel_stack(i) {
        //    return function(d) {
        //        return d.value[i];
        //    };
        //}
        //
        ////
        //for(var i = 2; i < 3; ++i)
        //    ccPolicyImplRowChart2.stack(ccImplementedGroup, ''+i, sel_stack(i));

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

//histogram = function(vector,options) {
//
//    options = options || {};
//    options.copy = options.copy === undefined ? true : options.copy;
//    options.pretty = options.pretty === undefined ? true : options.pretty;
//
//    var s = vector;
//    if (options.copy) s = s.slice();
//    s.sort(function (a, b) { return a - b; });
//
//    // TODO: use http://www.austinrochford.com/posts/2013-10-28-median-of-medians.html
//    // without sorting
//    function quantile(p) {
//        var idx = 1 + (s.length - 1) * p,
//            lo = Math.floor(idx),
//            hi = Math.ceil(idx),
//            h  = idx - lo;
//        return (1-h) * s[lo] + h * s[hi];
//    }
//
//    function freedmanDiaconis() {
//        var iqr = quantile(0.75) - quantile(0.25);
//        return 2 * iqr * Math.pow(s.length,-1/3);
//    }
//
//    function pretty(x) {
//        var scale = Math.pow(10, Math.floor(Math.log(x/10) / Math.LN10)),
//            err   = 10 / x * scale;
//        if (err <= 0.15) scale *= 10;
//        else if (err <= 0.35) scale *= 5;
//        else if (err <= 0.75) scale *= 2;
//        return scale * 10;
//    }
//
//    var h = freedmanDiaconis();
//    if (options.pretty) h = pretty(h);
//
//    function bucket(d) {
//        return h * Math.floor(d / h);
//    }
//
//    function tickRange(n) {
//        var extent  = [bucket(s[0]), h + bucket(s[s.length-1])],
//            buckets = Math.round((extent[1] - extent[0]) / h),
//            step    = buckets > n ? Math.round(buckets / n) : 1,
//            pad     = buckets % step; // to center whole step markings
//        return [extent[0] + h * Math.floor(pad/2),
//            extent[1] - h * Math.ceil(pad/2) + h*0.5, // pad upper extent for d3.range
//            h * step];
//    }
//
//    return {
//        size: h,
//        fun: bucket,
//        tickRange: tickRange
//    };
//};

//#### Versions

//Determine the current version of dc with `dc.version`
d3.selectAll('#version').text(dc.version);

// Determine latest stable version in the repo via Github API
d3.json('https://api.github.com/repos/dc-js/dc.js/releases/latest', function (error, latestRelease) {
    /*jshint camelcase: false */
    d3.selectAll('#latest').text(latestRelease.tag_name); /* jscs:disable */
});

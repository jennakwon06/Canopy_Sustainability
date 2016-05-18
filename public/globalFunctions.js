var onChange = function() {
    calculateIndex();
    fillTable(globalFilter.top(Infinity).reverse());
    drawBubblesOnMap(globalFilter.top(Infinity));
    drawScatterPlot(globalFilter.top(Infinity));

};

// Filter chart objects
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

var globalFilter;
var globalData;


var color = d3.scale.linear()
    .range(["green", "red"])
    .interpolate(d3.interpolateHsl);

var fields = ["ghg1", "ghg2", "ghg3"
    , "totalWaterUse", "totalWaterWithdrawl", "totalWaterDischarged"
    , "totalWaste", "wasteRecycled", "wasteSentToLandfill"
    , "totalEnergyConsumption" ];

/*
 * Calculate sustainability index based on selected weights
 */
function calculateIndex() {
    // calculate max index;
    var i;
    var maxValues = [];
    for (i = 0; i < fields.length; i++) {
        maxValues.push(d3.extent(globalData, function (d) {return +d[fields[i]];})[1]);
    }

    globalData.forEach(function (d) {
        var curScore = 0;
        var totalWeight = 0;

        // Gather selected scale weights
        for (i = 0; i < fields.length; i++) {
            if (+d[fields[i]]) { // nonzero if there's at least one data
                totalWeight += parseInt(document.getElementById(fields[i] + "Weight").value);
            }
        }

        // Gather data array

        // @TODO data info stays here if I want to show more than name & value.
        // @TODO if I want to show weights and details of index calculation, then it has to change dynamically.
        var arr = [];
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
                var score = Math.log(d[fields[i]]) / Math.log(maxValues[i]);
                score = score > 0 ? score : 0;
                curScore += score * object.weight;
            }
        }

        d.dataInfo = arr;

        if (!totalWeight) {
            d.sustIndex = NaN;
            d.color = "gray";
        } else {
            d.sustIndex = curScore;
            d.color = color(curScore);
        }
    });
}

/*
 * Interact with list view
 */
var fillTable = function(results){
    var table = $(".resultsTable");

    //clear table
    $('.resultsTable > tbody').empty();

    for (var i = 0; i <= results.length - 1; i++) {
        var tr = document.createElement('tr');

        tr.className += "clickableRow";
        tr.id += results[i].Name;

        var td1 = document.createElement('td');
        var td2 = document.createElement('td');
        var td3 = document.createElement('td');
        var td4 = document.createElement('td');
        var td5 = document.createElement('td');

        td1.appendChild(document.createTextNode(results[i].name));
        td2.appendChild(document.createTextNode(results[i].industry));
        td3.appendChild(document.createTextNode(results[i].sector));
        td4.appendChild(document.createTextNode(results[i].country));
        td5.appendChild(document.createTextNode(Math.round(results[i].sustIndex * 1000) / 1000));
        //console.log(results[i].sustIndex);
        //console.log("what's the sustindex");
        //console.log(results[i].sustIndex);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);

        var tr2 = document.createElement('tr');

        tr2.id = "rowInfo";
        var tr2td = document.createElement('td');
        var a1 = document.createAttribute("colspan");
        a1.value = 5;
        tr2td.setAttributeNode(a1);
        //$(tr2).hide();

        //var p = document.createElement('p');
        //console.log("what's my data info");
        //console.log(results[i].dataInfo);
        var html = "";
        for (var j = 0; j < results[i].dataInfo.length; j++) { // j iterates dataInfo array
            html += results[i].dataInfo[j].name + ": " + roundTo100(results[i].dataInfo[j].value)
                + "(" + results[i].dataInfo[j].weight + ") <br> ";
        }
        $(tr2td).html(html);
        $(tr2td).hide();

        $(tr).css("background-color", results[i].color);

        tr2.appendChild(tr2td);

        table.append(tr);
        table.append(tr2);
    }
};


/**
 * Monitor the scales
 */
function ghg1Count() {
    var x = "Weight: " + document.getElementById("ghg1Weight").value;
    document.getElementById("ghg1Count").innerHTML = x;
    onChange();
}
function ghg2Count() {
    var x = "Weight: " + document.getElementById("ghg2Weight").value;
    document.getElementById("ghg2Count").innerHTML = x;
    onChange();
}
function ghg3Count() {
    var x = "Weight: " + document.getElementById("ghg3Weight").value;
    document.getElementById("ghg3Count").innerHTML = x;
    onChange();
}
function totalWaterUseCount() {
    var x = "Weight: " + document.getElementById("totalWaterUseWeight").value;
    document.getElementById("totalWaterUseCount").innerHTML = x;
    onChange();
}
function totalWaterWithdrawlCount() {
    var x = "Weight: " + document.getElementById("totalWaterWithdrawlWeight").value;
    document.getElementById("totalWaterWithdrawlCount").innerHTML = x;
    onChange();
}
function totalWaterDischargedCount() {
    var x = "Weight: " + document.getElementById("totalWaterDischargedWeight").value;
    document.getElementById("totalWaterDischargedCount").innerHTML = x;
    onChange();
}
function totalWasteCount() {
    var x = "Weight: " + document.getElementById("totalWasteWeight").value;
    document.getElementById("totalWasteCount").innerHTML = x;
    onChange();
}
function wasteRecycledCount() {
    var x = "Weight: " + document.getElementById("wasteRecycledWeight").value;
    document.getElementById("wasteRecycledCount").innerHTML = x;
    onChange();
}
function wasteSentToLandfillCount() {
    var x = "Weight: " + document.getElementById("wasteSentToLandfillWeight").value;
    document.getElementById("wasteSentToLandfillCount").innerHTML = x;
    onChange();
}
function totalEnergyConsumptionCount() {
    var x = "Weight: " + document.getElementById("totalEnergyConsumptionWeight").value;
    document.getElementById("totalEnergyConsumptionCount").innerHTML = x;
    onChange();
}
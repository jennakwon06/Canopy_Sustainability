var onChange = function() {
    calculateIndex();
    fillTable(globalFilter.top(Infinity).reverse());
    drawMap(globalFilter.top(Infinity), false);
    xaxis = document.getElementById("xaxisMeasure");
    selectedX = xaxis.options[xaxis.selectedIndex].value;
    yaxis = document.getElementById("yaxisMeasure");
    selectedY = yaxis.options[yaxis.selectedIndex].value;
    drawScatterPlot(globalFilter.top(Infinity), selectedX, selectedY);
};


var xaxis;
var selectedX;
var yaxis;
var selectedY;

console.log("load order global funcs");

//var ccPolicyImplRowChart;

var color = d3.scale.linear()
    .range(["green", "red"])
    .interpolate(d3.interpolateHsl);

var fields = ["ghg1", "ghg2", "ghg3"
    , "totalWaterUse", "totalWaterWithdrawl", "totalWaterDischarged"
    , "totalWaste", "wasteRecycled", "wasteSentToLandfill"
    , "totalEnergyConsumption" ];

var fieldUnits = {
    "ghg1" : "(1000MT)",
    "ghg2" : "(1000MT)",
    "ghg3" : "(1000MT)",
    "totalWaterUse": "(1000m<sup>3</sup>)",
    "totalWaterWithdrawl" : "(1000m<sup>3</sup>)",
    "totalWaterDischarged" : "(1000m<sup>3</sup>)",
    "totalWaste" : "(1000MT)",
    "wasteRecycled" : "(1000MT)",
    "wasteSentToLandfill" : "(1000MT)",
    "totalEnergyConsumption" : "(1000MWh)"
};

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
        var a0 = document.createAttribute("class");
        a0.value = "sustIndexCell";
        td5.setAttributeNode(a0);

        td1.appendChild(document.createTextNode(results[i].name));
        td2.appendChild(document.createTextNode(results[i].industry));
        td3.appendChild(document.createTextNode(results[i].sector));
        td4.appendChild(document.createTextNode(results[i].country));
        td5.appendChild(document.createTextNode(Math.round(results[i].sustIndex * 1000) / 1000));

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

        d3.select(td5)
            .append("svg")
            .style("position", "relative")
            .attr("width", 15)
            .attr("height", 15)
            .append("g")
            .append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .style("fill", results[i].color);

        //$(tr).css("background-color", results[i].color);

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
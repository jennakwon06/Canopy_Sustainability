console.log("global func load");

var onChange = function(d) {
    calculateIndex();
    fillTable(globalFilter.top(Infinity).reverse());
    drawMap(globalFilter.top(Infinity));
    drawScatterPlot(globalFilter.top(Infinity), selectedX, selectedY);
    insertBreadCrumb(d);
};

var linkData = function(name, address, scatter, map, list) {
    var divPos = $("#resultBar").position();
    
    if (scatter) {
        var mapCirclePos = $("circle.mapCircle[address='" + address + "']").position();

        tooltipMap.transition()
            .duration(200)
            .style("opacity", .9)
            .style("left", (mapCirclePos.left + 5) + "px")
            .style("top", (mapCirclePos.top - 28) + "px");

        tooltipMap
            .html("City: " + address);


        // Induces bug - when map is zoomed in, it scales every bubble by 200
        // Make a radius lookup table?
        d3.selectAll("circle.mapCircle")
            .attr("r", function(d) {
                return (radius(d.count) * 200) / zoom.scale();
            });

        d3.selectAll("circle.mapCircle[address='" + address + "']")
            .attr("r", function(d) {
                return (radius(d.count) * 1000) / zoom.scale();
            });

        var tableRow = $(".clickableRow[name='" + name + "']");
        $(tableRow).css({"background-color" : "darkgrey"});

        // scroll div
        $('.resultListView').animate({
            scrollTop: tableRow.position().top - divPos.top + 60 //http://stackoverflow.com/questions/12507120/scrolltop-in-a-div;
        }, 200);

    } else if (map) { //only address available

        // @TODO sort and bring up rows
        var listCompaniesWithAddress = globalData.filter(function(d) {
            return d.address == address;
        });
        var listCompaniesWithoutAddress = globalData.filter(function(d) {
            return d.address != address;
        });
        var newlist = listCompaniesWithAddress.concat(listCompaniesWithoutAddress);
        fillTable(newlist);
        var tableRows = $(".clickableRow[address='" + address + "']");
        $(tableRows).css({"background-color" : "darkgrey"});
        $('.resultListView').animate({
            scrollTop: tableRows.position().top - divPos.top + 60
        }, 200);

        // Highlight scatter plot
        // @TODO should each scatter plot bubble have a tooltip?
        d3.selectAll("circle.scatterPlotCircle")
            .attr("r", 3.5);

        d3.selectAll("circle.scatterPlotCircle[address='" + address + "']")
            .attr("r", 15);

    } else if (list) { //both name and address available
        //Highlight scatter plot
        d3.selectAll("circle.scatterPlotCircle")
            .attr("r", 3.5);

        d3.selectAll("circle.scatterPlotCircle[address='" + address + "']")
            .attr("r", 15);

        // Display tooltip on map
        var mapCirclePos = $("circle.mapCircle[address='" + address + "']").position();

        tooltipMap.transition()
            .duration(200)
            .style("opacity", .9)
            .style("left", (mapCirclePos.left + 5) + "px")
            .style("top", (mapCirclePos.top - 28) + "px");

        tooltipMap
            .html("City: " + address);

        d3.selectAll("circle.mapCircle")
            .attr("r", function(d) {
                return (radius(d.count) * 200) / zoom.scale();
            });

        d3.selectAll("circle.mapCircle[address='" + address + "']")
            .attr("r", function(d) {
                return (radius(d.count) * 1000) / zoom.scale();
            });

    }
};

$.fn.exists = function () {
    return this.length !== 0;
};

var insertBreadCrumb = function(d) {
    if (!$("li#" + d).exists() && d !== undefined) {
        var breadCrumb = $("#breadcrumb");

        //<li><a href="#">ghg1 <span id="closeIcon"> &#10006; </span></a></li>

        var li = document.createElement('li');
        li.id = d;
        var a = document.createElement('a');
        var span = document.createElement('span');
        span.id = "closeIcon";

        a.appendChild(document.createTextNode(d));
        span.appendChild(document.createTextNode(" ✖"));

        li.appendChild(a);
        a.appendChild(span);

        $(li).click(function() {
            $(this).remove();
            window[this.id+"Chart"].filterAll();
            dc.redrawAll();
        });

        breadCrumb.append(li);
    }
};

var xaxis = document.getElementById("xaxisMeasure");
var selectedX = xaxis.options[xaxis.selectedIndex].value;
var yaxis = document.getElementById("yaxisMeasure");
var selectedY = yaxis.options[yaxis.selectedIndex].value;

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
        var aName = document.createAttribute("name");
        aName.value = results[i].name;
        tr.setAttributeNode(aName);

        var aAddress = document.createAttribute("address");
        aAddress.value = results[i].address;
        tr.setAttributeNode(aAddress);

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

        var html = "";
        for (var j = 0; j < results[i].dataInfo.length; j++) { // j iterates dataInfo array
            html += results[i].dataInfo[j].name + ": " + roundTo100(results[i].dataInfo[j].value)
                + "(" + results[i].dataInfo[j].weight + ") <br> ";
        }
        html += results[i].URL + "<br>";
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
    onChange("ghg1");
}
function ghg2Count() {
    var x = "Weight: " + document.getElementById("ghg2Weight").value;
    document.getElementById("ghg2Count").innerHTML = x;
    onChange("ghg2");
}
function ghg3Count() {
    var x = "Weight: " + document.getElementById("ghg3Weight").value;
    document.getElementById("ghg3Count").innerHTML = x;
    onChange("ghg3");
}
function totalWaterUseCount() {
    var x = "Weight: " + document.getElementById("totalWaterUseWeight").value;
    document.getElementById("totalWaterUseCount").innerHTML = x;
    onChange("totalWaterUse");
}
function totalWaterWithdrawlCount() {
    var x = "Weight: " + document.getElementById("totalWaterWithdrawlWeight").value;
    document.getElementById("totalWaterWithdrawlCount").innerHTML = x;
    onChange("totalWaterWithdrawl");
}
function totalWaterDischargedCount() {
    var x = "Weight: " + document.getElementById("totalWaterDischargedWeight").value;
    document.getElementById("totalWaterDischargedCount").innerHTML = x;
    onChange("totalWaterDischarged");
}
function totalWasteCount() {
    var x = "Weight: " + document.getElementById("totalWasteWeight").value;
    document.getElementById("totalWasteCount").innerHTML = x;
    onChange("totalWaste");
}
function wasteRecycledCount() {
    var x = "Weight: " + document.getElementById("wasteRecycledWeight").value;
    document.getElementById("wasteRecycledCount").innerHTML = x;
    onChange("wasteRecycled");
}
function wasteSentToLandfillCount() {
    var x = "Weight: " + document.getElementById("wasteSentToLandfillWeight").value;
    document.getElementById("wasteSentToLandfillCount").innerHTML = x;
    onChange("wasteSentToLandfill");
}
function totalEnergyConsumptionCount() {
    var x = "Weight: " + document.getElementById("totalEnergyConsumptionWeight").value;
    document.getElementById("totalEnergyConsumptionCount").innerHTML = x;
    onChange("totalEnergyConsumption");
}

/*
 * Populate sustainability index data field based on selected weights
 */
function calculateIndex() {
    // calculate max index;
    var i;
    var maxValues = [];
    for (i = 0; i < fieldsFilters.length; i++) {
        maxValues.push(d3.extent(globalData, function (d) {return +d[fieldsFilters[i]];})[1]);
    }

    globalData.forEach(function (d) {
        var curScore = 0;
        var totalWeight = 0;

        // Gather selected scale weights
        for (i = 0; i < fieldsFilters.length; i++) {
            if (+d[fieldsFilters[i]]) { // nonzero if there's at least one data
                totalWeight += parseInt(document.getElementById(fieldsFilters[i] + "Weight").value);
            }
        }

        // Gather data array

        // @TODO data info stays here if I want to show more than name & value.
        // @TODO if I want to show weights and details of index calculation, then it has to change dynamically.
        var arr = [];
        for (i = 0; i < fieldsFilters.length; i++) {
            if (+d[fieldsFilters[i]]) {
                var object = {
                    name: "",
                    weight: 0,
                    value: 0
                };
                object.name = fieldsFilters[i];
                object.weight = document.getElementById(fieldsFilters[i] + "Weight").value / totalWeight;
                object.value = +d[fieldsFilters[i]];
                arr.push(object);
                var score = Math.log(d[fieldsFilters[i]]) / Math.log(maxValues[i]);
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
            console.log(color);
            d.color = color(10);
        }
    });
}
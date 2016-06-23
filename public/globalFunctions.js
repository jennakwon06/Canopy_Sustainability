console.log("global func load");

/*
 * Interact with list view
 */
var fillTable = function(results) {
    var table = $(".resultsTable");

    //clear table
    $('.resultsTable > tbody').empty();

    for (var i = 0; i <= results.length - 1; i++) {
        var tr = document.createElement('tr');

        // set up rows with name and address for data linking
        tr.className += "clickableRow";
        var aName = document.createAttribute("name");
        aName.value = results[i].name;
        tr.setAttributeNode(aName);
        var aAddress = document.createAttribute("address");
        aAddress.value = results[i].address;
        tr.setAttributeNode(aAddress);

        var tdLogo = img_create("/images/companylogos/" + results[i].name + ".png");
        var tdName = document.createElement('td');
        var tdIndustry = document.createElement('td');
        var tdSector = document.createElement('td');
        var tdCountry = document.createElement('td');
        var tdSustIndex = document.createElement('td');
        var a0 = document.createAttribute("class");
        a0.value = "sustIndexCell";
        tdSustIndex.setAttributeNode(a0);

        tdName.appendChild(document.createTextNode(results[i].name));
        tdIndustry.appendChild(document.createTextNode(results[i].industry));
        tdSector.appendChild(document.createTextNode(results[i].sector));
        tdCountry.appendChild(document.createTextNode(results[i].country));
        tdSustIndex.appendChild(document.createTextNode(Math.round(results[i].sustIndex * 1000) / 1000));
        d3.select(tdSustIndex).append("svg").style("position", "relative").attr("width", 15)
            .attr("height", 15).append("g").append("rect").attr("width", 15).attr("height", 15)
            .style("fill", results[i].color);

        tr.appendChild(tdLogo);
        tr.appendChild(tdName);
        tr.appendChild(tdIndustry);
        tr.appendChild(tdSector);
        tr.appendChild(tdCountry);
        tr.appendChild(tdSustIndex);

        // Set up secondary rows that expand upon click of primary rows
        var tr2 = document.createElement('tr');
        tr2.id = "rowInfo";
        var tr2td = document.createElement('td');
        var a1 = document.createAttribute("colspan");
        a1.value = 5;
        tr2td.setAttributeNode(a1);
        var html = "";
        for (var j = 0; j < results[i].dataInfo.length; j++) { // j iterates dataInfo array
            html += results[i].dataInfo[j].name + ": " + roundTo100(results[i].dataInfo[j].value)
                + "(" + results[i].dataInfo[j].weight + ") <br> ";
        }
        html += results[i].URL + "<br>";
        $(tr2td).html(html);
        $(tr2td).hide();

        tr2.appendChild(tr2td);

        table.append(tr);
        table.append(tr2);
    }
};

var onChange = function(d) {
    calculateIndex();
    fillTable(globalFilter.top(Infinity).reverse());
    drawMap(globalFilter.top(Infinity));
    drawScatterPlot(globalFilter.top(Infinity), selectedX, selectedY);
    insertBreadCrumb(d);
};

var linkData = function(name, address, scatter, map, list) {
    var divPos = $("#resultBar").position();

    var mapCirclePos = $("circle.mapCircle[address='" + address + "']").position();
    var scatterCirclePosName = $("circle.scatterPlotCircle[name='" + name + "']").position();
    var scatterCirclePosAddress = $("circle.scatterPlotCircle[name='" + name + "']").position();

    if (scatter) {
        // move tooltip map
        tooltipMap.transition()
            .duration(200)
            .style("opacity", .9)
            .style("left", (mapCirclePos.left + 5) + "px")
            .style("top", (mapCirclePos.top - 28) + "px");

        tooltipMap
            .html("City: " + address);

        d3.selectAll("circle.scatterPlotCircle")
            .attr("r", 3.5);

        // scroll to specific company in list
        var tableRow = $(".clickableRow[name='" + name + "']");
        $(tableRow).css({"background-color" : "darkgrey"});
        $('.resultListView').animate({
            scrollTop: tableRow.position().top - divPos.top + 60 //http://stackoverflow.com/questions/12507120/scrolltop-in-a-div;
        }, 200);

    } else if (map) { //only address available

        // Sorting and refilling tables
        var listCompaniesWithAddress = globalData.filter(function(d) {return d.address == address;});
        var listCompaniesWithoutAddress = globalData.filter(function(d) {return d.address != address;});
        var newlist = listCompaniesWithAddress.concat(listCompaniesWithoutAddress);
        fillTable(newlist);
        var tableRows = $(".clickableRow[address='" + address + "']");
        $(tableRows).css({"background-color" : "darkgrey"});
        $('.resultListView').animate({
            scrollTop: tableRows.position().top - divPos.top + 60
        }, 200);

        // interaction method with scatter plot circles
        d3.selectAll("circle.scatterPlotCircle")
            .attr("r", 3.5);

        d3.selectAll("circle.scatterPlotCircle[address='" + address + "']")
            .attr("r", 15);

        //@TODO instead of resizing scatterplot circles, maybe attach tooltip to individual bubble?
        //d3.selectAll("circle.scatterPlotCircle[address='" + address + "']")
        //    .append("div")
        //    .attr("class", "tooltipScatter")
        //    .style("opacity", 0.9)
        //    .style("left", function(d) {
        //        console.log("HELLO");
        //        console.log(d);
        //        console.log(this);
        //        return d.position().left + 5 + "px";
        //    })
        //    .style("top", function(d) {
        //        console.log(d);
        //        return d.position().top - 28 + "px";
        //    });


        //d3.selectAll("circle.scatterPlotCircle[address='" + address + "']")
        //    .append("div")
        //    .attr("class", "tooltipScatter")
        //    .style("opacity", 0.9)
        //    .style("left", function(d) {
        //        console.log("HELLO");
        //        console.log(d);
        //        console.log(this);
        //        return d.position().left + 5 + "px";
        //    })
        //    .style("top", function(d) {
        //        console.log(d);
        //        return d.position().top - 28 + "px";
        //    });



        //$("circle.scatterPlotCircle[name='" + name + "']").position();
        //tooltipScatter.transition()
        //    .duration(200)
        //    .style("opacity", .9)
        //    .style("left", (scatterCirclePosAddress.left + 5) + "px")
        //    .style("top", (scatterCirclePosAddress.top - 28) + "px");
        //
        //tooltipScatter
        //    .html("City: " + address);
    } else if (list) { //both name and address available
        //Highlight scatter plot
        d3.selectAll("circle.scatterPlotCircle")
            .attr("r", 3.5);

        d3.selectAll("circle.scatterPlotCircle[name='" + name + "']")
            .attr("r", 15);

        tooltipMap.transition()
            .duration(200)
            .style("opacity", .9)
            .style("left", (mapCirclePos.left + 5) + "px")
            .style("top", (mapCirclePos.top - 28) + "px");

        tooltipMap
            .html("City: " + address);

        //d3.selectAll("circle.mapCircle")
        //    .attr("r", function(d) {
        //        return (radius(d.count) * 200) / zoom.scale();
        //    });
        //
        //d3.selectAll("circle.mapCircle[address='" + address + "']")
        //    .attr("r", function(d) {
        //        return (radius(d.count) * 1000) / zoom.scale();
        //    });
    }
};

$.fn.exists = function () {
    return this.length !== 0;
};

var insertBreadCrumb = function(d) {
    if (!$("li#" + d).exists() && d !== undefined) {
        var breadCrumb = $("#breadcrumb");

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
            onChange();
        });

        breadCrumb.append(li);
    }
};

var xaxis = document.getElementById("xaxisMeasure");
var selectedX = xaxis.options[xaxis.selectedIndex].value;
var yaxis = document.getElementById("yaxisMeasure");
var selectedY = yaxis.options[yaxis.selectedIndex].value;

function img_create(src, alt, title) {
    var img = document.createElement('img');
    img.src= src;
    img.height = 30;
    img.width = 30;
    if (alt!=null) img.alt= alt;
    if (title!=null) img.title= title;
    return img;

    //https://jsfiddle.net/maccman/2kxxgjk8/3/
}
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
            d.color = color(d.sustIndex);
        }
    });
}
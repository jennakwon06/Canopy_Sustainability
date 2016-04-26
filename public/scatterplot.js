//@TODO refactor to take in different x and y axis values

function changeX() {
    var xaxis = document.getElementById("xaxisMeasure");
    var selectedX = xaxis.options[xaxis.selectedIndex].value;
    var yaxis = document.getElementById("yaxisMeasure");
    var selectedY = yaxis.options[yaxis.selectedIndex].value;
    drawScatterPlot(globalFilter.top(Infinity), selectedX, selectedY)
}

function changeY() {
    var xaxis = document.getElementById("xaxisMeasure");
    var selectedX = xaxis.options[xaxis.selectedIndex].value;
    var yaxis = document.getElementById("yaxisMeasure");
    var selectedY = yaxis.options[yaxis.selectedIndex].value;
    drawScatterPlot(globalFilter.top(Infinity), selectedX, selectedY)
}


function drawScatterPlot(results, xAxisVal, yAxisVal) {

    function isBlank(str) {
        return (!str || /^\s*$/.test(str));
    }

    //clear previous
    d3.select(".scatterSVG").remove();


    var margin = { top: 20, right: 50, bottom: 100, left: 60 },
        outerWidth = $("#resultBar").width(),
        outerHeight = $("#resultBar").height(),
        width = outerWidth - margin.left - margin.right,
        height = outerHeight - margin.top - margin.bottom;

    console.log(outerHeight);

    var x = d3.scale.linear()
        .range([0, width]).nice();

    var y = d3.scale.linear()
        .range([height, 0]).nice();

    var xMax = d3.max(results, function(d) { return d[xAxisVal]; }) * 1.05,
        xMin = d3.min(results, function(d) { return d[xAxisVal]; }),
        xMin = xMin > 0 ? 0 : xMin,
        yMax = d3.max(results, function(d) { return d[yAxisVal]; }) * 1.05,
        yMin = d3.min(results, function(d) { return d[yAxisVal]; }),
        yMin = yMin > 0 ? 0 : yMin;

    x.domain([xMin, xMax]);
    y.domain([yMin, yMax]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickSize(-height)
        .ticks(8, ",.1s");


    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickSize(-width)
        //.ticks(8, ",.1s");


    var color = d3.scale.category10();

    var cValue = function(d) { return d.name;};

    var zoomBeh = d3.behavior.zoom()
        .x(x)
        .y(y)
        .scaleExtent([0, 500])
        .on("zoom", zoom);


    var svg = d3.select("#scatter")
        .append("svg")
        .attr("class", "scatterSVG")
        .attr("width", outerWidth)
        .attr("height", outerHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoomBeh);

    console.log("executed? 1");

    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    function transform(d) {
        return "translate(" + x(d[xAxisVal]) + "," + y(d[yAxisVal]) + ")";
    }

    function zoom() {
        svg.select(".x.axis").call(xAxis);
        svg.select(".y.axis").call(yAxis);
        svg.selectAll(".scatterPlotCircle")
            .attr("transform", transform);
    }

    svg.append("rect")
        .attr("class", "scatterRect")
        .attr("width", width)
        .attr("height", height);

    // x-axis
    svg.append("g")
        .classed("x axis", true)
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .classed("label", true)
        .attr("x", width)
        .attr("y", margin.bottom - 10)
        .style("text-anchor", "end")
        .text(xAxisVal);

    svg.append("g")
        .classed("y axis", true)
        .call(yAxis)
        .append("text")
        .classed("label", true)
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yAxisVal);


    var objects = svg.append("svg")
        .classed("objects", true)
        .attr("width", width)
        .attr("height", height);

    objects.append("svg:line")
        .classed("axisLine hAxisLine", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", width)
        .attr("y2", 0)
        .attr("transform", "translate(0," + height + ")");

    objects.append("svg:line")
        .classed("axisLine vAxisLine", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", height);

    if (xAxisVal !== undefined && yAxisVal !== undefined
        && !isBlank(xAxisVal) && !isBlank(yAxisVal)) {

        objects.selectAll(".scatterPlotCircle")
            .data(results)
            .enter().append("circle")
            .attr("class", "scatterPlotCircle")
            .attr("r", 3.5)
            .attr("data-toggle", "modal")
            .attr("data-target", "#myModal")
            .attr("transform", function(d) {
                return "translate(" + x(d[xAxisVal]) + "," + y(d[yAxisVal]) + ")"
            })
            .style("fill", function (d) {
                return color(cValue(d));
            })
            .on("mouseover", function (d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(d.name + "<br/> (" + +d[xAxisVal]
                        + ", " + +d[yAxisVal] + ")")
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .on("click", function(d) {
                console.log("ayo");
                d3.select(".list-group")
                    .append("li")
                    .attr("class", "modal-list-item list-group-item")
                    .attr("value", 10)
                    .attr("id", 10)
                    .text("FROM SCATTER PLOT");
            });
    }
}

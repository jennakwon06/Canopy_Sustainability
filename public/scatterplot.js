function changeAxisAndDrawScatterPlot() {
    var selectedX = document.getElementById("xaxisMeasure").options[document.getElementById("xaxisMeasure").selectedIndex].value;
    var selectedY = document.getElementById("yaxisMeasure").options[document.getElementById("yaxisMeasure").selectedIndex].value;
    drawScatterPlot(globalFilter.top(Infinity), selectedX, selectedY)
}


function drawScatterPlot(results, xAxisVal, yAxisVal) {
    //clear previous
    d3.select(".scatterSVG").remove();

    var margin = { top: 20, right: 10, bottom: 30, left: 60};
    var outerWidth = $(".resultScatterPlotView").width();
    var outerHeight = $(".resultScatterPlotView").height();
    var width = outerWidth - margin.left - margin.right;
    var height = outerHeight - margin.top - margin.bottom;

    var xMax = d3.extent(results, function (d) {return +d[xAxisVal];})[1] * 1.05,
        xMin = d3.extent(results, function (d) {return +d[yAxisVal];})[0],
        xMin = xMin > 0 ? 0 : xMin,
        yMax = d3.extent(results, function (d) {return +d[yAxisVal];})[1] * 1.05,
        yMin = d3.extent(results, function (d) {return +d[yAxisVal];})[0],
        yMin = yMin > 0 ? 0 : yMin;

    var xScale = d3.scale
        //.log()
        //.clamp(true)
        .linear()
        .domain([xMin, xMax])
        .range([0, width])
        .nice();

    var yScale = d3.scale
        //.log()
        //.clamp(true)
        .linear()
        .domain([yMin, yMax])
        .range([height, 0])
        .nice();

    var x;


    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .tickSize(-height)
        .ticks(8, ",.1s");

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .tickSize(-width)
        .ticks(8, ",.1s");

    var zoomBeh = d3.behavior.zoom()
        .x(xScale)
        .y(yScale)
        .scaleExtent([0, 500])
        .on("zoom", zoom);

    var svg = d3.select("#scatter")
        .append("svg")
        .attr("class", "scatterSVG")
        .call(zoomBeh)
        .attr("width", outerWidth)
        .attr("height", outerHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    tooltipScatter = d3.select(".tooltipScatter").empty() ?
        d3.select("body").append("div").attr("class", "tooltipScatter").style("opacity", 0)
        : d3.select(".tooltipScatter");

    function transform(d) {
        return "translate(" + xScale(d[xAxisVal]) + "," + yScale(d[yAxisVal]) + ")";
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
        .text(xAxisVal + fieldUnits[xAxisVal]);

    svg.append("g")
        .classed("y axis", true)
        .call(yAxis)
        .append("text")
        .classed("label", true)
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yAxisVal + fieldUnits[yAxisVal]);

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


    // Draw scatter plot
    if (xAxisVal !== undefined && yAxisVal !== undefined
        && !isBlank(xAxisVal) && !isBlank(yAxisVal)) {
        objects.selectAll(".scatterPlotCircle")
            .data(results)
            .enter().append("circle")
            .attr("class", "scatterPlotCircle")
            .attr("r", 3.5)
            .attr("transform", function(d) {
                return "translate(" + xScale(d[xAxisVal]) + "," + yScale(d[yAxisVal]) + ")"
            })
            .attr("name", function(d) {
                return d.name;
            })
            .attr("address", function(d) {
                return d.address;
            })
            .style("fill", function (d) {
                return sustIndexColorScale(d.sustIndex);
            })
            .on("mouseover", function (d) {
                tooltipScatter.html(d.name + "<br/> (" + +d[xAxisVal]
                    + ", " + +d[yAxisVal] + ")");

                showInteractionElements(d.name, d.address, true, false, false);
            })
            .on("mouseout", function (d) {
                hideInteractionElements();
            })
            .on("click", function(d) {
                showInteractionElements(d.name, d.address, true, false, false);
            });
    }

    //<----- Code for draw trend line; credit to http://bl.ocks.org/benvandyke/8459843 -->
    // get the x and y values for least squares
    var xSeries = results.map(function(d) { return parseFloat(d[xAxisVal]); });
    var ySeries = results.map(function(d) { return parseFloat(d[yAxisVal]); });

    var leastSquaresCoeff = leastSquares(xSeries, ySeries);

    var x1 = xSeries[0];
    var y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
    var x2 = xSeries[xSeries.length - 1];
    var y2 = leastSquaresCoeff[0] * xSeries.length + leastSquaresCoeff[1];
    var trendData = [[x1,y1,x2,y2]];

    var trendline = svg.selectAll(".trendline")
        .data(trendData);

    trendline.enter()
        .append("line")
        .attr("class", "trendline")
        .attr("x1", function(d) { return xScale(d[0]); })
        .attr("y1", function(d) { return yScale(d[1]); })
        .attr("x2", function(d) { return xScale(d[2]); })
        .attr("y2", function(d) { return yScale(d[3]); })
        .attr("stroke", "black")
        .attr("stroke-width", 1);

    svg.append("text")
        .text("eq: " + decimalFormat(leastSquaresCoeff[0]) + "x + " +
            decimalFormat(leastSquaresCoeff[1]))
        .attr("class", "text-label")
        .attr("x", function(d) {return xScale(x2) - 60;})
        .attr("y", function(d) {return yScale(y2) - 30;});

    // display r-square on the chart
    svg.append("text")
        .text("r-sq: " + decimalFormat(leastSquaresCoeff[2]))
        .attr("class", "text-label")
        .attr("x", function(d) {return xScale(x2) - 60;})
        .attr("y", function(d) {return yScale(y2) - 10;});
}

/**
 * Least Squares Trendline
 *
 * @param xSeries
 * @param ySeries
 * @returns slope, intercept, and r-square of the line
 */
function leastSquares(xSeries, ySeries) {
    var reduceSumFunc = function(prev, cur) { return prev + cur; };

    var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
    var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

    var ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
        .reduce(reduceSumFunc);

    var ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
        .reduce(reduceSumFunc);

    var ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar); })
        .reduce(reduceSumFunc);

    var slope = ssXY / ssXX;
    var intercept = yBar - (xBar * slope);
    var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);

    return [slope, intercept, rSquare];
}

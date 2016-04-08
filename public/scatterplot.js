//@TODO refactor to take in different x and y axis values

function changeX() {
    console.log("hello from scatterplot");
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


    console.log('x axis')
    console.log(xAxisVal)
    console.log(typeof(xAxisVal))
    console.log(typeof(xAxisVal) != 'undefined')
    console.log(xAxisVal === undefined)

    console.log('y axis')
    console.log(yAxisVal)
    console.log(typeof(yAxisVal))
    console.log(typeof(yAxisVal) != 'undefined')
    console.log(yAxisVal === undefined)


    //clear previous
    d3.select(".scatterPlotSVG").remove();

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    /*
     * value accessor - returns the value to encode for a given data object.
     * scale - maps value to a visual display encoding, such as a pixel position.
     * map function - maps from data value to display value
     * axis - sets up axis
     */


    // setup x
    var xValue = function(d) { return +d[xAxisVal]}, // data -> value
        xScale = d3.scale.linear().range([0, width]), // value -> display
        xMap = function(d) { return xScale(xValue(d));}, // data -> display
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    // setup y
    var yValue = function(d) { return +d[yAxisVal];}, // data -> value
        yScale = d3.scale.linear().range([height, 0]), // value -> display
        yMap = function(d) { return yScale(yValue(d));}, // data -> display
        yAxis = d3.svg.axis().scale(yScale).orient("left");

    // setup fill color
    var cValue = function(d) { return d.name;},
        color = d3.scale.category10();

    // add the graph canvas to the body of the webpage
    var svg = d3.select(".resultScatterPlotView").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "scatterPlotSVG")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // add the tooltip area to the webpage
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(results, xValue)-1, d3.max(results, xValue)+1]);
    yScale.domain([d3.min(results, yValue)-1, d3.max(results, yValue)+1]);

    // x-axis
    svg.append("g")
        .attr("class", "x axis scatterPlot")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(xAxisVal);

    // y-axis
    svg.append("g")
        .attr("class", "y axis scatterPlot")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yAxisVal);

    if (xAxisVal !== undefined && yAxisVal !== undefined
        && !isBlank(xAxisVal) && !isBlank(yAxisVal)) {
        svg.selectAll(".dot")
            .data(results)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .attr("data-toggle", "modal")
            .attr("data-target", "#myModal")
            .style("fill", function (d) {
                return color(cValue(d));
            })
            .on("mouseover", function (d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(d.name + "<br/> (" + xValue(d)
                        + ", " + yValue(d) + ")")
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    }
}

console.log("gradient bar load");

var drawGradientBar = function() {

    var w = $("#gradientLegend").width();
    var h = 15;

    var key = d3.select("#gradientLegend")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var legend = key.append("defs")
        .append("svg:linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");

    legend.append("stop").attr("offset", "0%").attr("stop-color", "hsl(120, 100%, 50%)").attr("stop-opacity", 1);
    legend.append("stop").attr("offset", "100%").attr("stop-color", "hsl(360, 100%, 50%)").attr("stop-opacity", 1);

    key.append("rect")
        .attr("width", w)
        .attr("height", h)
        .style("fill", "url(#gradient)")
        .attr("transform", "translate(0,10)");

    var x = d3.scale
        .linear()
        .range([w, 0])
        .domain([1, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top")
        .tickPadding(-6);

    //.call(xAxis)
    //    .append("text")
    //    .classed("label", true)
    //    .attr("x", width)
    //    .attr("y", margin.bottom - 10)
    //    .style("text-anchor", "end")
    //    .text(xAxisVal);
    //

    key.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(41,10)")
        .call(xAxis)
        .append("text")
        //.attr("transform", "rotate(-90)")
        .attr("x", w)
        .attr("y", "0")
        .attr("dx", "0")
        .attr("dy", "0.71em")
        .style("text-anchor", "end");
        //.text("axis title");
};
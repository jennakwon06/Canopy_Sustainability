var drawGradientBar2 = function() {

    var spaces = [
        {name: "HSL", interpolate: d3.interpolateHsl}
    ];


    var y = d3.scale.ordinal()
        .domain(spaces.map(function (d) {
            return d.name;
        }))
        .rangeRoundBands([0, 500], .09);


    var margin = 20,
        width = 960 - margin - margin,
        height = 20;

    var color = d3.scale.linear()
        .domain([0, width])
        .range(["green", "red"]);

    console.log(d3.select("#gradientLegend"));

    var space = d3.select("#gradientLegend")
        .data(spaces)
        .enter().append("div")
        .attr("class", "space")
        .style("width", width + "px")
        .style("height", height + "px")
        .style("left", margin + "px")
        .style("top", function (d, i) {
            console.log(d);
            return y(d.name) + "px";
        });

    space.append("canvas")
        .attr("width", width)
        .attr("height", 1)
        .style("width", width + "px")
        .style("height", height + "px")
        .each(render);

    space.append("div")
        .style("line-height", height + "px")
        .text(function (d) {
            return d.name;
        });

    function render(d) {
        var context = this.getContext("2d"),
            image = context.createImageData(width, 1);
        color.interpolate(d.interpolate);
        for (var i = 0, j = -1, c; i < width; ++i) {
            c = d3.rgb(color(i));
            image.data[++j] = c.r;
            image.data[++j] = c.g;
            image.data[++j] = c.b;
            image.data[++j] = 255;
        }
        context.putImageData(image, 0, 0);
    }
}

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
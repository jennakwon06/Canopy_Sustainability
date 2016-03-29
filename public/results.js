// every time a filter button is clicked, update the map.
// the update map reads the global filter results.
// the update map aggregates the count data of the countries.
// for example, us : 278, canada : 23, etc.
// then, it draws the only the countries that appear in the map through filtering
// and then, the radius is changed with respect to the count.


var width = 1000,
    height = 800;

var projection = d3.geo.mercator()
    .translate([width / 2, height / 2])
    .scale((width - 1) / 2 / Math.PI);

//http://bl.ocks.org/mbostock/3681006
// Different zoom example
var zoom = d3.behavior.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#worldMap").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("margin-top", 20);

var g = svg.append("g");

svg.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height);

svg.call(zoom)
    .call(zoom.event);

//var radius = d3.scale.sqrt()
//    .domain([0, 1e6])
//    .range([0, 15]);


//var legend = svg.append("g")
//    .attr("class", "legend")
//    .attr("transform", "translate(" + (width - 50) + "," + (height - 20) + ")")
//    .selectAll("g")
//    .data([1e6, 5e6, 1e7])
//    .enter().append("g");

//legend.append("circle")
//    .attr("cy", function(d) { return -radius(d); })
//    .attr("r", radius);
//
//legend.append("text")
//    .attr("y", function(d) { return -2 * radius(d); })
//    .attr("dy", "1.3em")
//    .text(d3.format(".1s"));
//

var countries;

d3.json("/world-50m.json", function(error, world) {

    //https://bl.ocks.org/mbostock/9943478
    if (error) throw error;

    g.append("path")
        .datum({type: "Sphere"})
        .attr("class", "sphere")
        .attr("d", path);

    g.append("path")
        .datum(topojson.merge(world, world.objects.countries.geometries))
        .attr("class", "land")
        .attr("d", path);

    g.append("path")
        .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
        .attr("class", "boundary")
        .attr("d", path);

    countries = topojson.feature(world, world.objects.countries).features;
    // example json file with featuers https://raw.githubusercontent.com/mbostock/d3/5b981a18db32938206b3579248c47205ecc94123/test/data/us-counties.json
});

function drawBubbles(results) {

    console.log("from inside draw bubbles");
    console.log(results.length);

    var mapping = {};

    for (var i = 0; i < results.length; i++) {
        var key = results[i].country;
        if (key in mapping) {
            mapping[key] += 1;
        } else {
            mapping[key] = 1;
        }
    }
    console.log(mapping);

    var array = [];

    d3.csv("/countryMap.csv", function(error, mappings) {

        console.log(mappings);

        for (i = 0; i < mapping.length; i++) {
            var object = {country: undefined, count: undefined, id: undefined};
            object.country = mapping.key;
            object.count = mapping.value;
            object.id = mappings["ISO3166-1-numeric"];
            array.push(object);
        }
    });

    console.log(array);

    // construct an array of objects that are like following
    //[Object, Object, ....]
    //Object {
    // country: US
    // count: ?
    // id: ?

    //filter the countries down to the ones that match results

    //look up country in countryMap.svg


    g.append("g")
        .attr("class", "bubble")
        .selectAll("circle")
        .data(countries)
        .enter()
        .append("circle")
        .attr("transform", function(d) {return "translate(" + path.centroid(d) + ")"; })
        .attr("r", 10)
        .style("fill, red");
}

function zoomed() {
    g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

d3.select(self.frameElement).style("height", height + "px");

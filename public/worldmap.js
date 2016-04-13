// every time a filter button is clicked, update the map.
// the update map reads the global filter results.
// the update map aggregates the count data of the countries.
// for example, us : 278, canada : 23, etc.
// then, it draws the only the countries that appear in the map through filtering
// and then, the radius is changed with respect to the count.
var path;
var projection;

drawMap();

function drawMap() {
    var width = 960,
        height = 500;

    projection = d3.geo.mercator();

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

    path = d3.geo.path()
        .projection(projection);

    var svg = d3.select("#worldMap").append("svg")
        .attr("class", "mapSvg")
        .attr("width", width)
        .attr("height", height)
        .style("margin-top", 20);

    var g = svg.append("g");

    svg.call(zoom)
        .call(zoom.event);


    //var legend = svg.append("g")
    //    .attr("class", "legend")
    //    .attr("transform", "translate(" + (width - 50) + "," + (height - 20) + ")")
    //    .selectAll("g")
    //    .data([1e6, 5e6, 1e7])
    //    .enter().append("g");
    //
    //legend.append("circle")
    //    .attr("cy", function(d) { return -radius(d); })
    //    .attr("r", radius);
    //
    //legend.append("text")
    //    .attr("y", function(d) { return -2 * radius(d); })
    //    .attr("dy", "1.3em")
    //    .text(d3.format(".1s"));

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

        //countries = topojson.feature(world, world.objects.countries).features;
        // example json file with featuers https://raw.githubusercontent.com/mbostock/d3/5b981a18db32938206b3579248c47205ecc94123/test/data/us-counties.json
    });


    //d3.csv("/countryMap.csv", function(error, map) {
    //    mappings = map;
    //});
}

function drawBubblesOnMap(results) {
    d3.select(".bubble").remove();

    var arrayOfLocations = [];

    for (var i = 0; i < results.length; i++) {
        var temp = {
            "address": "",
            "count": 0,
            "latitude": 0,
            "longitude": 0,
            "companies": []
        };

        temp.address = results[i].address;
        temp.latitude = results[i].latitude;
        temp.longitude = results[i].longitude;
        temp.count = 1;
        temp.companies.push(results[i]);
        arrayOfLocations.push(temp);
    }

    arrayOfLocations.sort(function(a,b) {
        return (a.address > b.address) ? 1 : ((b.address > a.address) ? -1 : 0);} ); //SORT BY ADDRESS

    for (i = arrayOfLocations.length - 1; i > 0; i--) {
        if (arrayOfLocations[i - 1].address == arrayOfLocations[i].address) {
            arrayOfLocations[i - 1].count += arrayOfLocations[i].count;
            arrayOfLocations[i - 1].companies.push.apply(arrayOfLocations[i - 1].companies, arrayOfLocations[i].companies);
            arrayOfLocations[i] = null;
        }
    }

    arrayOfLocations = arrayOfLocations.filter(Boolean);

    console.log("is null filtered?");
    console.log(arrayOfLocations);

    var radius = d3.scale.sqrt()
        .domain([0, 1e6])
        .range([0, 15]);

    var cValue = function(d) { return d.address;},
        color = d3.scale.category10();

    d3.select(".mapSvg g").append("g")
        .attr("class", "bubble")
        .selectAll("circle")
        .attr("class", "mapCircle")
        .data(arrayOfLocations)
        .enter() //A LOT OF EMPTY CIRCLE TAGS ARE GENERATED - CA THIS BE BETTER ?
        .append("circle")
        .attr("data-toggle", "modal")
        .attr("data-target", "#mapModal")
        .attr("locationName", function(d) {
            return d.address;
        })
        .attr("transform", function(d) {
            return "translate(" + projection([d.longitude, d.latitude]) + ")"; })
        .attr("r", function(d) {
            return (radius(d.count) * 200);
        })
        .style("fill", function(d) {
            return color(cValue(d));})
        ;
}

function zoomed() {
    d3.select(".mapSvg g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")")
}

d3.select(self.frameElement).style("height", height + "px");

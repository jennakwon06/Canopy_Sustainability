// every time a filter button is clicked, update the map.
// the update map reads the global filter results.
// the update map aggregates the count data of the countries.
// for example, us : 278, canada : 23, etc.
// then, it draws the only the countries that appear in the map through filtering
// and then, the radius is changed with respect to the count.
var countries;
var path;
var mappings;

drawMap();

function drawMap() {
    var width = 960,
        height = 500;

    var projection = d3.geo.mercator()
        .translate([width / 2, height / 2])
        .scale((width - 1) / 2 / Math.PI);

//http://bl.ocks.org/mbostock/3681006
// Different zoom example
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

        console.log(world)

        countries = topojson.feature(world, world.objects.countries).features;
        // example json file with featuers https://raw.githubusercontent.com/mbostock/d3/5b981a18db32938206b3579248c47205ecc94123/test/data/us-counties.json
    });


    d3.csv("/countryMap.csv", function(error, map) {
        mappings = map;
    });
}

function drawBubblesOnMap(results) {

    d3.select(".bubble").remove();


    var mapping = {};

    for (var i = 0; i < results.length; i++) {
        var key = results[i].country;
        if (key in mapping) {
            mapping[key] += 1;
        } else {
            mapping[key] = 1;
        }
    }

    var array = [];

    for (i = 0; i < Object.keys(mapping).length; i++) {
        for (var j = 0; j < mappings.length; j++) {
            if (mappings[j]["ISO3166-1-Alpha-2"] === Object.keys(mapping)[i]) {
                var object = {country: undefined, count: undefined, id: undefined};
                object.country = Object.keys(mapping)[i];
                object.count = mapping[object.country]; //look up value
                object.id = mappings[j]["ISO3166-1-numeric"];
                array.push(object);
            }
        }
    }

    var radius = d3.scale.sqrt()
        .domain([0, 1e6])
        .range([0, 15]);

    var cValue = function(d) { return d.id;},
        color = d3.scale.category10();

    d3.select(".mapSvg g").append("g")
        .attr("class", "bubble")
        .selectAll("circle")
        .attr("class", "mapCircle")
        .data(countries)
        .enter() //A LOT OF EMPTY CIRCLE TAGS ARE GENERATED - CA THIS BE BETTER ?
        .append("circle")
        .filter(function(d) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].id == d.id) {
                    return true;
                }
            }
            return false;
        })
        .attr("data-toggle", "modal")
        .attr("data-target", "#mapModal")
        .attr("countryId", function(d) {
            return d.id;
        })
        .attr("transform", function(d) {
            console.log(d)
            console.log(path.centroid(d));
            return "translate(" + projection([-33.7, 84.3]) + ")"; })
        .attr("r", function(d) {
            for (var i = 0; i < array.length; i++) {
                console.log(array[i].count);
                if (array[i].id == d.id) {
                    return (radius(array[i].count) * 150);
                }
            }
        })
        .style("fill", function(d) {
            return color(cValue(d));})
        ;

//loading cities
    //// load and display the cities
    //d3.csv("cities.csv", function(error, data) {
    //    g.selectAll("circle")
    //        .data(data)
    //        .enter()
    //        .append("a")
    //        .attr("xlink:href", function(d) {
    //            return "https://www.google.com/search?q="+d.city;}
    //        )
    //        .append("circle")
    //        .attr("cx", function(d) {
    //            return projection([d.lon, d.lat])[0];
    //        })
    //        .attr("cy", function(d) {
    //            return projection([d.lon, d.lat])[1];
    //        })
    //        .attr("r", 5)
    //        .style("fill", "red");
    //});
}

function zoomed() {
    d3.select(".mapSvg g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")")
}

d3.select(self.frameElement).style("height", height + "px");

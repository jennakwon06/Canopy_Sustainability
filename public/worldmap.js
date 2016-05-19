// every time a filter button is clicked, update the map.
// the update map reads the global filter results.
// the update map aggregates the count data of the countries.
// for example, us : 278, canada : 23, etc.
// then, it draws the only the countries that appear in the map through filtering
// and then, the radius is changed with respect to the count.
var path;
var projection;

drawMap();

//@TODO fix gdal problems and draw this map
//http://www.tnoda.com/blog/2013-12-07
function drawMap() {

    var width = $("#resultBar").width(),
        height = $("#resultBar").height();

    projection = d3.geo.mercator()
        .translate([width / 2, height / 2])
        .scale((width - 1) / 2 / Math.PI);

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

    path = d3.geo.path()
        .projection(projection);

    var svg = d3.select("#worldMap").append("svg")
        .attr("class", "mapSvg")
        .attr("width", width)
        .attr("height", height)
        .style("margin-top", 0);

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

    });
}

function drawBubblesOnMap(results) {
    console.log("draw bubbles called");

    d3.select(".bubble").remove();

    var arrayOfLocations = [];

    for (var i = 0; i < results.length; i++) {
        var temp = {
            "name": "",
            "address": "",
            "count": 0,
            "latitude": 0,
            "longitude": 0,
            "sustIndex": 0,
            "sustIndexCount": 0,
            "companies": []
        };

        temp.name = results[i].name;
        temp.address = results[i].address;
        temp.latitude = results[i].latitude;
        temp.longitude = results[i].longitude;
        temp.count = 1;
        temp.sustIndex += results[i].sustIndex;
        temp.companies.push(results[i]);
        arrayOfLocations.push(temp);
    }

    // location accumulator

    arrayOfLocations.sort(function(a,b) {
        return (a.address > b.address) ? 1 : ((b.address > a.address) ? -1 : 0);} ); //SORT BY ADDRESS

    for (i = arrayOfLocations.length - 1; i > 0; i--) {
        if (arrayOfLocations[i - 1].address == arrayOfLocations[i].address) {
            arrayOfLocations[i - 1].count += arrayOfLocations[i].count;
            arrayOfLocations[i - 1].companies.push.apply(arrayOfLocations[i - 1].companies, arrayOfLocations[i].companies);
            // Some companies have NaN index
            if (arrayOfLocations[i].sustIndex) {
                arrayOfLocations[i - 1].sustIndexCount += arrayOfLocations[i].sustIndexCount;
                arrayOfLocations[i - 1].sustIndex += arrayOfLocations[i].sustIndex;
            }
            arrayOfLocations[i] = null;
        }
    }

    arrayOfLocations = arrayOfLocations.filter(Boolean);

    console.log(arrayOfLocations);

    // normalize sust index
    for (i = arrayOfLocations.length - 1; i > 0; i--) {
        arrayOfLocations[i].sustIndex /= arrayOfLocations[i].count;
    }

    console.log(arrayOfLocations);

    var radius = d3.scale.sqrt()
        .domain([0, 1e6])
        .range([0, 15]);

    arrayOfLocations.sort(function (a,b) {
        return b.count - a.count;
    });

    //svg.append("g")
    //    .attr("class", "bubble")
    //    .selectAll("circle")
    //    .data(topojson.feature(us, us.objects.counties).features
    //        .sort(function(a, b) { return b.properties.population - a.properties.population; }))
    //    .enter().append("circle")
    //    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
    //    .attr("r", function(d) { return radius(d.properties.population); });

    d3.select(".mapSvg g").append("g")
        .attr("class", "bubble")
        .selectAll("circle")
        .data(arrayOfLocations)
        .sort(function(a,b) {
            return b.count - a.count;}) //@SORT BUBBLES BY SIZE
        .enter() //A LOT OF EMPTY CIRCLE TAGS ARE GENERATED - CA THIS BE BETTER ?
        .append("circle")
        .attr("data-toggle", "modal")
        .attr("data-target", "#myModal")
        .attr("class", "mapCircle")
        .attr("locationName", function(d) {
            return d.address;
        })
        .attr("transform", function(d) {
            return "translate(" + projection([d.longitude, d.latitude]) + ")"; })
        .attr("r", function(d) {
            return (radius(d.count) * 150);
        })
        .style("fill", function(d) {
            return color(d.sustIndex);})
        .on("click", function(d) {
            d3.selectAll(".tooltip-box p").remove();

            d3.select(".tooltip-box")
                .append("p")
                .attr("class", "address")
                .html("City: " + d.address
                    + "<br> Sustainability Index: " + Math.round(d.sustIndex * 100) / 100);

            d3.select(".tooltip-box")
                .append("p")
                .attr("class", "cityCompanies")
                .html("Companies: <br>");

            var cities = "";

            for (var i = 0; i < d.companies.length; i++) {
                cities += d.companies[i].name + "(" + Math.round(d.companies[i].sustIndex * 100) / 100 + ")" + "<br>";
            }

            d3.select(".cityCompanies")
                .append("p")
                .html(cities);

        });
}

function zoomed() {
    d3.select(".mapSvg g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")")
}

d3.select(self.frameElement).style("height", height + "px");

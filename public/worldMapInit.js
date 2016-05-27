var path;
var projection;

function zoomed() {
    d3.select(".mapSvg g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")")
}

function drawBubbles(results) {

    if (!d3.select(".bubble").empty()) {
        d3.select(".bubble").remove();
    }

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

    // normalize sust index
    for (i = arrayOfLocations.length - 1; i > 0; i--) {
        arrayOfLocations[i].sustIndex /= arrayOfLocations[i].count;
    }

    var radius = d3.scale.sqrt()
        .domain([0, 1e6])
        .range([0, 15]);

    arrayOfLocations.sort(function (a,b) {
        return b.count - a.count;
    });

    var tooltipDiv = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    d3.select(".mapSvg g")
        //.insert('g', '.land + *')
        .append("g")
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
        .on("mouseover", function(d) {
            tooltipDiv.transition()
                .duration(200)
                .style("opacity", .9)
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            tooltipDiv
                .html("City: " + d.address
                    + "<br> Sustainability Index: " + Math.round(d.sustIndex * 100) / 100);
        })
        .on("mouseout", function(d) {
            tooltipDiv.transition()
                .duration(500)
                .style("opacity", 0);
        });
}

function drawMap(results, inputWidth) {

    if (d3.select(".mapSvg").empty() || inputWidth) {
        d3.select(".mapSvg").remove();

        var width = $(".resultMapView").width(),
            height = 350;

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

        var z = color;

        // Add a legend for the color values.
        var legend = svg.selectAll(".legend")
            .data(z.ticks(6).slice(1).reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(" + (width + 20 - 80) + "," + (20 + i * 20) + ")"; });

        legend.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .style("fill", z);

        legend.append("text").attr("x", 20)
            .attr("y", 10)
            .attr("dy", ".25em")
            .text(String);


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

            drawBubbles(results);
        });
    } else {
        drawBubbles(results);
    }
}
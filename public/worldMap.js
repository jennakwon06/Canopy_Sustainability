var path;
var projection;
var radius = d3.scale.sqrt() //accurate encoding https://groups.google.com/forum/#!topic/d3-js/mcJ8GE6_fq4
    .domain([0, 1e6])
    .range([0, 15]);

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

    arrayOfLocations.sort(function (a,b) {
        return b.count - a.count;
    });

    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltipMap")
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
        .attr("class", "mapCircle")
        .attr("address", function(d) {
            return d.address;
        })
        .attr("transform", function(d) {
            return "translate(" + projection([d.longitude, d.latitude]) + ")"; })
        .attr("r", function(d) {
            return (radius(d.count) * 200);
        })
        .style("fill", function(d) {
            return color(d.sustIndex);})
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9)
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            tooltip
                .html("City: " + d.address
                    + "<br> Sustainability Index: " + Math.round(d.sustIndex * 100) / 100);
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", function(d) {
            linkData(false, d.address, false, true, false);
        });
}

function drawMap(results, inputWidth) {

    if (d3.select(".mapSvg").empty() || inputWidth) {
        d3.select(".mapSvg").remove();

        var width = $(".resultMapView").width();
        var height = $(".resultMapView").height();

        var x = d3.scale.linear()
            .domain([0, width])
            .range([0, width]);

        var y = d3.scale.linear()
            .domain([0, height])
            .range([height, 0]);

        projection = d3.geo.mercator()
            .translate([width / 2, height / 2])
            .scale((width - 1) / 2 / Math.PI);

        var zoom = d3.behavior.zoom()
            .scaleExtent([1, 20])
            .scale(2)
            .x(x)
            .y(y)
            .on("zoom",function() {
                g.attr("transform", function(d) {
                    //var panX = d3.event.translate[0];
                    //var panY = d3.event.translate[1];
                    //var scale = d3.event.scale;
                    //
                    //panX = panX > 10 ? 10 : panX;
                    //var maxX = -(scale-1)*width-10;
                    //panX = panX < maxX ? maxX : panX;
                    //zoom.translate([panX, panY]);
                    //console.log("x: "+panX+" scale: "+scale);
                    ////console.log("x: "+(panX/scale));
                    //
                    //svg.select(".x.axis").call(xAxis);
                    //svg.selectAll("path.lines")
                    //    .attr("d", function(d) { return line(d.values); });
                    //svg.selectAll("circle")
                    //    .attr("cx", function(d) { return x(d.date); })
                    //    .attr("cy", function(d) { return y(d.value); });


                    return "translate("+ d3.event.translate.join(",")+ ")scale(" + d3.event.scale + ")"
                });

                g.selectAll("circle")
                    .attr("r", function(d){
                        var self = d3.select(this);
                        var r = (radius(d.count) * 200) / d3.event.scale;
                        //self.style("stroke-width", r < 4 ? (r < 2 ? 0.5 : 1) : 2);
                        return r;
                    });
            });

        var svg = d3.select("#worldMap").append("svg")
            .attr("class", "mapSvg")
            .attr("width", width)
            .attr("height", height)
            .style("margin-top", 0);

        var g = svg.append("g");

        g.call(zoom);

        path = d3.geo.path()
            .projection(projection);

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
        });

        d3.json("/us.json", function(error, us) {
            if (error) throw error;

            g.append("path")
                .datum(topojson.feature(us, us.objects.land))
                .attr("class", "land")
                .attr("d", path);

            g.append("path")
                .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
                .attr("class", "boundary")
                .attr("d", path);

            drawBubbles(results);
        });



    } else {
        drawBubbles(results);
    }
}
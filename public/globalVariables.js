console.log("loading global var file")

/**
 * Used to pass around raw data table between client calls and js calls
 */
var globalRawDataTable;


/**
 * Used to pass around changes in scatter plot axes selection
 * @type {Element}
 */
var xaxis = document.getElementById("xaxisMeasure");
var selectedX = xaxis.options[xaxis.selectedIndex].value;
var yaxis = document.getElementById("yaxisMeasure");
var selectedY = yaxis.options[yaxis.selectedIndex].value;

/**
 * Tooltips on applications
 */
var tooltipScatter;

/**
 * Used to toggle viz panels
 */
var iScatter = 0;
var iMap = 0;
var iList = 0;

/**
 * Used in map files
 */
var path;
var projection;
var radius = d3.scale.sqrt() //accurate encoding https://groups.google.com/forum/#!topic/d3-js/mcJ8GE6_fq4
    .domain([0, 1e6])
    .range([0, 15]);
var tooltipMap;
var zoom;



/**
 * These are initialized in filters.js
 */
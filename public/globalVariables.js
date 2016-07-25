/**
 * Initialized in scatterplot.js
 */
var tooltipScatter;

/**
 * Initialized in worldMap.js
 */
var tooltipMap;

/**
 * Initialized in filters.js
 */
var globalFilter; // filter maintained on name field
var globalData; // holds all data objects

var fieldsFilters = ["ghg1", "ghg2", "ghg3"
    , "totalWaterUse", "totalWaterWithdrawl", "totalWaterDischarged"
    , "totalWaste", "wasteRecycled", "wasteSentToLandfill"
    , "totalEnergyConsumption"];


var sustIndexColorScale = d3.scale.linear()
    .range(["green", "red"])
    .interpolate(d3.interpolateHsl);

/**
 * Chart objects
 */
var companiesCount = dc.dataCount('.companiesCount');
var industryChart = dc.scrollableRowChart('#industry_chart');
var sectorChart = dc.scrollableRowChart('#sector_chart');
var ghg1Chart = dc.barChart('#ghg1Chart'); // EMISSIONS
var ghg2Chart = dc.barChart('#ghg2Chart');
var ghg3Chart = dc.barChart('#ghg3Chart');
var totalWaterUseChart = dc.barChart('#totalWaterUseChart'); //WATER
var totalWaterWithdrawlChart = dc.barChart('#totalWaterWithdrawlChart');
var totalWaterDischargedChart = dc.barChart('#totalWaterDischargedChart');
var totalWasteChart = dc.barChart("#totalWasteChart"); //WASTE
var wasteRecycledChart = dc.barChart("#wasteRecycledChart");
var wasteSentToLandfillChart = dc.barChart("#wasteSentToLandfillChart");
var totalEnergyConsumptionChart = dc.barChart("#totalEnergyConsumptionChart"); //ENERGY
var ccPolicyImplRowChart2 = dc.stackedRowChart('#ccPolicyImplRowChart2'); //BINAR YBARS

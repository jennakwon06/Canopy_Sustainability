# Canopy = Interactive data visualization tool for analyzing S&P 500 companies' sustainability-related data

Hosted at www.canopysustainability.herokuapp.com! 

## Ways to Use This Tool
On the left panel, users can dynamically select subsets of companies with 1 categorical filter (Sector) and 9 numerical filters (Environmental data). These filters are themselves data visualizations; they show the distribution of companies along different data dimensions. Log scale was chosen to show this distribution as most companies cluster around lower end of the environmental data. The filters are linked with each other; filtering on one dimension will filter data on other dimensions. Users can incrementally filter companies along all dimensions or choose to use only a few filters. An example usage is to use sector filter first, then use filters on environmental data for sectoral analysis. Users can give weights to each dimension based on their perceived relative importance of dimensions. These weights affect calculation of sustainability index and its formula is shown on the bottom of this page. The filters dynamically update results on the right panel. 

On the right panel, three different visualization panels (scatterplot, geo map, and expandable list) support data analytics of filtered companies. The scatterplot panel allows users to plot data dimensions on 2D cartesian coordinates and discover linear relationships between dimensions. The geo map panel allows users to view the locations of companies and see how geographical distributions of companies change with different filters. The expandable list allows users to view calculated sustainability index as well as respective raw data by expanding on rows. These panels can be sized to full screen by clicking on expand  icon.

## Data Source
Environmental data were gathered through queries to Bloomberg Terminal. Originally, the data values are scraped from GRI (Global Reporting Initiatives) sustainability reports. Some of company metadata such as revenue, number of employees, and assets owned by each company were also gathered through Bloomberg Terminal. Other metadata were gathered from various sources. Headquarter addresses were listed in Wikipedia , which were then used to gather lat/long coordinates by sending API requests to Photon through Geopy . These coordinates used for creating company geomap. Company URLs were gathered through using BlockSpring 's Google Sheets Plug-in. Company logos were gathered through queries to Clearbit Logo API.

## Data Fields 

Categorize companies geographically and sectorally
-  Industry
-  Sector
-  Headquarter Address
-  Latitude / Longitude of headquarter

View each company's raw environmental data
- GHG Scope 1 Emissions
- GHG Scope 2 Emissions
- GHG Scope 3 Emissions
- Total Water Use
- Total Water Withdrawl
- Total Water Discharged
- Total Waste
- Waste Recycled
- Waste Sent to Landfill
- Total Energy Consumption

Normalize raw data with indicators of company impact
- Revenue of Company
- Number of Employees (To be gathered)
- Assets owned by company

## Contact
Questions? Please email Jenna at jkwon47 at gatech dot edu!

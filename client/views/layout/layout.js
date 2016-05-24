var i = 0;

Template.layout.rendered = function() {
	// scroll to anchor
	$('body').on('click', 'a', function(e) { 
		var href = $(this).attr("href");
		if(!href) {
			return;
		}
		if(href.length > 1 && href.charAt(0) == "#") {
			var hash = href.substring(1);
			if(hash) {
				e.preventDefault();

				var offset = $('*[id="' + hash + '"]').offset();

				if (offset) {
					$('html,body').animate({ scrollTop: offset.top - 60 }, 400);
				}
			}
		} else {
			if(href.indexOf("http://") != 0 && href.indexOf("https://") != 0 && href.indexOf("#") != 0) {
				$('html,body').scrollTop(0);
			}
		}
	});

	console.log("from layout");
	$.getScript("/utility.js");
	$.getScript("/filters.js");
	$.getScript("/worldMap.js");
	$.getScript("/scatterplot.js");
	$.getScript("/globalFunctions.js");
};

Template.layout.events({ 
    "click": function(event) { // Fix Bootstrap Dropdown Menu Collapse on click outside Menu
        var clickover = $(event.target).closest(".dropdown-toggle").length;
        var opened = $(".navbar-collapse").hasClass("in");
        if (opened === true && !clickover) {
            $('.navbar-collapse').collapse('hide');
        }
    },

    "keyup": function(event) {
        if (event.keyCode === 27) { // Bootstrap Dropdown Menu Collapse on ESC pressed
            var opened = $(".navbar-collapse").hasClass("in");
            if (opened === true) {
                $('.navbar-collapse').collapse('hide');
            }
        }
    },

	'click #collapseFilterButton': function(e) {
		if (i % 2 == 0) {
			//$('#controlBar').animate({
			//	left: "0px"
			//}, 500, function() {});

			$('#filterBar').animate({
				opacity: 0
			}, 500, function() {});

			d3.select(".mapSvg")
				.attr("width", "auto");

			$('#resultBar').css({"width" : "100vw","position" :"fixed"});

			$(".glyphicon-arrow-left").addClass( "glyphicon-arrow-right");
			$(".glyphicon-arrow-right").removeClass( "glyphicon-arrow-left");

		} else {
			$(".glyphicon-arrow-right").addClass( "glyphicon-arrow-left");
			$(".glyphicon-arrow-left").removeClass( "glyphicon-arrow-right");

			$('#resultBar').removeAttr("style");
			//$('#controlBar').removeAttr("style");

			$('#filterBar').animate({
				opacity: 1
			}, 500, function() {

			});
		}
		i++;
	},


	'click #resetAllFiltersButton': function(e) {
		dc.redrawAll();
		dc.filterAll();
		onChange();
		//$('.companiesCount').html(globalFilter.top(Infinity).length);
	},

	'click #resetAllScalesButton': function(e) {
		for (var i = 0; i < fields.length; i++) {
			document.getElementById(fields[i] + "Weight").value = "100";
		}
		onChange();
	},

	//'click #applyFilterButton': function (e) {
	//	console.log('checking database connection');
	//	console.log(Filters.find().count());
	//	console.log(Results.find().count());
	//	console.log(PDFs.find().count());
    //
	//	$('#saveResultButton').removeClass("disabled");
	//	$('#resultListViewButton').removeClass("disabled");
	//	$('#resultMapViewButton').removeClass("disabled");
	//	$('#resultScatterPlotViewButton').removeClass("disabled");
    //
	//	e.preventDefault();
    //
	//	//$('.initView').attr("style", "display: none");
	//	//$('.resultListView').attr("style", "display: block");
    //
	//	calculateIndex();
    //
	//	fillTable(globalFilter.top(Infinity).reverse());
	//	$(".rowInfo").hide();
    //
	//	drawBubblesOnMap(globalFilter.top(Infinity));
	//	drawScatterPlot(globalFilter.top(Infinity));
    //
	//	Filters.insert({
	//	});
	//},

	'click #sortByCompanyButton': function(e) {
		fillTable(globalFilter.top(Infinity).reverse())
	},

	'click #sortByIndustryButton': function(e) {
		fillTable(globalFilter.top(Infinity).sort(function(a,b) {
			return a.industry.localeCompare(b.industry);
		}))

	},

	'click #sortBySectorButton': function(e) {
		fillTable(globalFilter.top(Infinity).sort(function(a,b) {
			return a.sector.localeCompare(b.sector);
		}))
	},

	'click #sortByCountryButton': function(e) {
		fillTable(globalFilter.top(Infinity).sort(function(a,b) {
			return a.country.localeCompare(b.country);
		}))
	},

	'click #sortByScoreButton': function(e) {
		fillTable(globalFilter.top(Infinity).sort(function(a,b) {
				//if( !isFinite(a.sustIndex) && !isFinite(b.sustIndex) ) {
				//	return 0;
				//}
				//if( !isFinite(a.sustIndex) ) {
				//	return 1;
				//}
				//if( !isFinite(b.sustIndex) ) {
				//	return -1;
				//}
				//return a.sustIndex - b.sustIndex;
			if (isNaN(a.sustIndex) && isNaN(b.sustIndex)) {
				return 0;
			} else if (isNaN(a.sustIndex)) {
				return 1;
			} else if (isNaN(b.sustIndex)) {
				return -1;
			} else {
				return a.sustIndex - b.sustIndex;
			}
		}))
	},

});

Template.PrivateLayoutLeftMenu.rendered = function() {
	$(".menu-item-collapse .dropdown-toggle").each(function() {
		if($(this).find("li.active")) {
			$(this).removeClass("collapsed");
		}
		$(this).parent().find(".collapse").each(function() {
			if($(this).find("li.active").length) {
				$(this).addClass("in");
			}
		});
	});
	
};

Template.PrivateLayoutLeftMenu.events({
	"click .toggle-text": function(e, t) {
		e.preventDefault();
		$(e.target).closest("ul").toggleClass("menu-hide-text");
	}
	
});

Template.PrivateLayoutLeftMenu.helpers({
	
});

Template.PrivateLayoutRightMenu.rendered = function() {
	$(".menu-item-collapse .dropdown-toggle").each(function() {
		if($(this).find("li.active")) {
			$(this).removeClass("collapsed");
		}
		$(this).parent().find(".collapse").each(function() {
			if($(this).find("li.active").length) {
				$(this).addClass("in");
			}
		});
	});
	
};

Template.PrivateLayoutRightMenu.events({
	"click .toggle-text": function(e, t) {
		e.preventDefault();
		$(e.target).closest("ul").toggleClass("menu-hide-text");
	}
	
});

Template.PrivateLayoutRightMenu.helpers({
	
});

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
	/*TEMPLATE_RENDERED_CODE*/
	$.getScript("/filters.js");
	$.getScript("/worldmap.js");
	$.getScript("/scatterplot.js");
};

var fillTable = function(results){
	var table = $(".resultsTable");

	//clear table
	$('.resultsTable > tbody').empty();

	for (var i = 0; i <= results.length - 1; i++) {
		var tr = document.createElement('tr');

		tr.className += "clickableRow";
		tr.id += results[i].Name;

		var td1 = document.createElement('td');
		var td2 = document.createElement('td');
		var td3 = document.createElement('td');
		var td4 = document.createElement('td');
		var td5 = document.createElement('td');

		td1.appendChild(document.createTextNode(results[i].name));
		td2.appendChild(document.createTextNode(results[i].industry));
		td3.appendChild(document.createTextNode(results[i].sector));
		td4.appendChild(document.createTextNode(results[i].country));
		td5.appendChild(document.createTextNode(Math.round(results[i].sustIndex * 1000) / 1000));
		//console.log(results[i].sustIndex);
		//console.log("what's the sustindex");
		//console.log(results[i].sustIndex);

		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		tr.appendChild(td4);
		tr.appendChild(td5);

		var tr2 = document.createElement('tr');

		tr2.id = "rowInfo";
		var tr2td = document.createElement('td');
		var a = document.createAttribute("colspan");
		a.value = 5;
		tr2td.setAttributeNode(a);
		//$(tr2).hide();

		var p = document.createElement('p');
		console.log("what's my data info");
		console.log(results[i].dataInfo);
		var html = ""
		for (var j = 0; j < results[i].dataInfo.length; j++) { // j iterates dataInfo array
			html += results[i].dataInfo[j].name + ": " + results[i].dataInfo[j].value + "<br> ";
		}
		$(p).html(html);
		$(p).hide();

		tr2.appendChild(tr2td.appendChild(p));

		table.append(tr);
		table.append(tr2);
	}
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

	'click #resetAllFiltersButton': function(e) {
		dc.redrawAll();
		dc.filterAll();
		//$('.companiesCount').html(globalFilter.top(Infinity).length);
	},

	'click #applyFilterButton': function (e) {
		console.log('checking database connection');
		console.log(Filters.find().count());
		console.log(Results.find().count());
		console.log(PDFs.find().count());

		$('#saveResultButton').removeClass("disabled");
		$('#resultListViewButton').removeClass("disabled");
		$('#resultMapViewButton').removeClass("disabled");
		$('#resultScatterPlotViewButton').removeClass("disabled");

		e.preventDefault();

		$('.initView').attr("style", "display: none");
		$('.resultListView').attr("style", "display: block");

		calculateIndex();

		fillTable(globalFilter.top(Infinity).reverse());
		$(".rowInfo").hide();

		drawBubblesOnMap(globalFilter.top(Infinity));
		drawScatterPlot(globalFilter.top(Infinity));

		Filters.insert({
		});
	},

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
			return a.sustIndex - b.sustIndex;
		}))
	},

	'click #myModalLabel':function (e) {

	}
});


Template.PublicLayoutLeftMenu.rendered = function() {
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

Template.PublicLayoutLeftMenu.events({
	"click .toggle-text": function(e, t) {
		e.preventDefault();
		$(e.target).closest("ul").toggleClass("menu-hide-text");
	}
	
});

Template.PublicLayoutLeftMenu.helpers({
	
});

Template.PublicLayoutRightMenu.rendered = function() {
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

Template.PublicLayoutRightMenu.events({
	"click .toggle-text": function(e, t) {
		e.preventDefault();
		$(e.target).closest("ul").toggleClass("menu-hide-text");
	}
	
});

Template.PublicLayoutRightMenu.helpers({
	
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

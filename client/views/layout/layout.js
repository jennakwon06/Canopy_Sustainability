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
		tr.setAttribute("data-toggle", "modal");
		tr.setAttribute("data-target", "#myModal");

		var td1 = document.createElement('td');
		var td2 = document.createElement('td');
		var td3 = document.createElement('td');
		var td4 = document.createElement('td');

		td1.appendChild(document.createTextNode(results[i].Name));
		td2.appendChild(document.createTextNode(results[i].industry));
		td3.appendChild(document.createTextNode(results[i].sector));
		td4.appendChild(document.createTextNode(results[i].country));

		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		tr.appendChild(td4);
		//tr.data(results[i]);
		table.append(tr);
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

		$('.initView').attr("style", "display: none");
		$('.resultListView').attr("style", "display: block");

		$('#saveResultButton').removeClass("disabled");
		$('#resultListViewButton').removeClass("disabled");
		$('#resultMapViewButton').removeClass("disabled");
		$('#resultScatterPlotViewButton').removeClass("disabled");

		e.preventDefault();

		fillTable(globalFilter.top(Infinity).reverse());
		drawBubblesOnMap(globalFilter.top(Infinity));
		drawScatterPlot(globalFilter.top(Infinity));

		Filters.insert({
		});
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

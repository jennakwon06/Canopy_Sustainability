Template.ComparePanel.rendered = function() {
    var results = Results.find({}).fetch();
    var numResults = Results.find({}).count();

    var table = $(".resultsTable");

    for (var i = 0; i < numResults; i++) {
        var tr = document.createElement('tr');

        tr.className += "clickableRow";
        tr.id += i;
        tr.setAttribute("data-toggle", "modal");
        tr.setAttribute("data-target", "#myModal");

        var td1 = document.createElement('td');
        var td2 = document.createElement('td');

        td1.appendChild(document.createTextNode("Row" + i));
        td2.appendChild(document.createTextNode(results[i].results));

        tr.appendChild(td1);
        tr.appendChild(td2);

        table.append(tr);
    }
};

Template.ComparePanel.events({
});

Template.ComparePanel.helpers({
	
});
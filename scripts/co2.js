// Load the data
d3.csv("data/condensed_data.csv").then(function (data) {

    // Set the dimensions of the canvas
    var margin = { top: 20, right: 20, bottom: 70, left: 40 },
        width = 600 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    // Set the ranges
    var x = d3.scaleBand().range([0, width]).padding(0.1);
    var y = d3.scaleLinear().range([height, 0]);


    // Define the canvas
    var svg = d3.select("#co").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the data in the domains
    x.domain(data.map(function (d) { return d.year; }));
    y.domain([0, d3.max(data, function (d) { return d.Value; })]);

    // Append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return x(d.year); })
        .attr("width", x.bandwidth())
        .attr("y", function (d) { return y(d.Value); })
        .attr("height", function (d) { return height - y(d.Value); })
        .attr("fill", '#FF6961');

    // Add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickValues(x.domain().filter(function (d, i) { return !(i % 5) })));

    // Add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add a legend
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 0)
        .style("text-anchor", "middle")
        .text("CO2 concentration in PPM");

});


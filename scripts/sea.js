d3.csv("../data/Change_in_Mean_Sea_Levels.csv").then(function (data) {
    var margin = { top: 20, right: 20, bottom: 30, left: 200 }, // Increased left margin
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scaleLinear().range([0, width]),
        y = d3.scaleBand().range([height, 0]).padding(0.1);



    // Add legend


    var svg = d3.select("#seaChart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var sumValues = d3.nest()
        .key(function (d) { return d.Measure; })
        .rollup(function (v) { return d3.sum(v, function (d) { return d.Value; }); })
        .entries(data);

    sumValues.sort(function (a, b) { return a.value - b.value; }); // Changed sorting to ascending

    x.domain([0, d3.max(sumValues, function (d) { return d.value; })]);
    y.domain(sumValues.map(function (d) { return d.key; }));

    svg.selectAll(".bar")
        .data(sumValues)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("width", function (d) { return x(d.value); })
        .attr("y", function (d) { return y(d.key); })
        .attr("height", y.bandwidth())
        .attr("fill", "#ADD8E6"); // Changed bar color to pastel yellow

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (width + margin.right - 220) + "," + (height + margin.bottom - 100) + ")");

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", "#ADD8E6"); // Changed color to pastel blue

    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text("Increase in Sea Level in mm");

    var worldLine = sumValues.filter(function (d) { return d.key === "World"; })[0].value;

    svg.append("line")
        .attr("x1", x(worldLine))
        .attr("y1", 0)
        .attr("x2", x(worldLine))
        .attr("y2", height)
        .style("stroke-width", 2)
        .style("stroke", "red")
        .style("fill", "none");
});

// Set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 60 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// Append the svg object to the body of the page
var svg = d3.select("#chart1")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

// Read the data
d3.csv("../data/Transposed_Annual_Surface_Temperature_Change.csv").then(function (data) {

  // List of groups (here I have one group per column)
  var allGroup = Array.from(new Set(data.map(function (d) { return d.Country })))

  // Add the options to the button
  d3.select("#selectButton")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // Text showed in the menu
    .attr("value", function (d) { return d; }) // Corresponding value returned by the button

  // A color scale: one color for each group
  var myColor = d3.scaleOrdinal()
    .domain(allGroup)
    .range(d3.schemeSet2);

  // Add X axis --> it is a date format
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function (d) { return d.Year; }))
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(7));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([d3.min(data, function (d) { return +d.Value; }), d3.max(data, function (d) { return +d.Value; })])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Initialize line with first group of the list
  var line = svg
    .append('g')
    .append("path")
    .datum(data.filter(function (d) { return d.Country == allGroup[0] }))
    .attr("d", d3.line()
      .x(function (d) { return x(d.Year) })
      .y(function (d) { return y(+d.Value) })
    )
    .attr("stroke", function (d) { return myColor("valueA") })
    .style("stroke-width", 4)
    .style("fill", "none")

  // A function that update the chart
  function update(selectedGroup) {

    // Create new data with the selection?
    if (selectedGroup === 'World') {
      dataFilter = data
    } else {
      var dataFilter = data.filter(function (d) { return d.Country == selectedGroup })
    }

    // Give these new data to update line
    line
      .datum(dataFilter)
      .transition()
      .duration(1000)
      .attr("d", d3.line()
        .x(function (d) { return x(d.Year) })
        .y(function (d) { return y(+d.Value) })
      )
      .attr("stroke", function (d) { return myColor(selectedGroup) })
  }

  // When the button is changed, run the updateChart function
  d3.select("#selectButton").on("change", function (d) {
    // Recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")
    // Run the updateChart function with this selected option
    update(selectedOption)
  })

})


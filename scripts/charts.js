
// Chart setup
const margin = { top: 20, right: 30, bottom: 30, left: 60 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Create SVG for CO2 Concentration Line Chart
const svg1 = d3.select("#chart1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Create SVG for CO2 Growth Scatter Plot
const svg2 = d3.select("#chart2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Date / Time
const parseYearMonth = d3.timeParse("%YM%m");

// Load data
d3.csv("../data/data.csv", function (d) {
    return {
        date: parseYearMonth(d.Date),
        value: +d.Value,
        indicator: d.Indicator
    };
}).then(function (data) {
    console.log("Loaded data:", data); // Diagnostic log

    if (data.length === 0) {
        console.error("No data loaded. Check the CSV path and format.");
    } else {
        console.log("First data entry:", data[0]);
    }

    // Filter data for the line chart
    let concentrationData = data.filter(d => d.indicator.includes("Concentrations") && !d.indicator.includes("Change"));

    // X axis - Time scale
    const x = d3.scaleTime()
        .domain(d3.extent(concentrationData, d => d.date))
        .range([0, width]);
    svg1.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Y axis - Linear scale for concentration
    const y1 = d3.scaleLinear()
        .domain([300, d3.max(concentrationData, d => d.value)])
        .range([height, 0]);
    svg1.append("g")
        .call(d3.axisLeft(y1));

    // Line chart
    svg1.append("path")
        .datum(concentrationData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x(d => x(d.date))
            .y(d => y1(d.value))
        );

    // Filter data for the scatter plot
    let growthData = data.filter(d => d.indicator.includes("Change"));

    // Y axis - Linear scale for percentage change
    const y2 = d3.scaleLinear()
        .domain([0, d3.max(growthData, d => d.value)])
        .range([height, 0]);
    svg2.append("g")
        .call(d3.axisLeft(y2));

    // Scatter plot
    svg2.selectAll("dot")
        .data(growthData)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y2(d.value))
        .attr("r", 5)
        .style("fill", "#ffab00");
}).catch(function (error) {
    console.error("Error loading data:", error);
});
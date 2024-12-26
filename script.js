document.addEventListener('DOMContentLoaded', function() {
    const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

    // Fetch the GDP data
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const dataset = data.data;

            // Set up chart dimensions and margins
            const margin = { top: 60, right: 30, bottom: 60, left: 60 };
            const width = 900 - margin.left - margin.right;
            const height = 500 - margin.top - margin.bottom;

            // Create SVG container
            const svg = d3.select('#chart')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            // Set up scales
            const xScale = d3.scaleTime()
                .domain([new Date(dataset[0][0]), new Date(dataset[dataset.length - 1][0])])
                .range([0, width]);

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, d => d[1])])
                .range([height, 0]);

            // Create axes
            const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.timeFormat('%Y'));
            const yAxis = d3.axisLeft(yScale).ticks(10);

            svg.append('g')
                .attr('id', 'x-axis')
                .attr('transform', `translate(0,${height})`)
                .call(xAxis)
                .selectAll("text")
                .style("fill", "#00ffcc")
                .style("font-family", "Orbitron, sans-serif");

            svg.append('g')
                .attr('id', 'y-axis')
                .call(yAxis)
                .selectAll("text")
                .style("fill", "#00ffcc")
                .style("font-family", "Orbitron, sans-serif");

            // Create bars
            svg.selectAll('.bar')
                .data(dataset)
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr('data-date', d => d[0])
                .attr('data-gdp', d => d[1])
                .attr('x', d => xScale(new Date(d[0])))
                .attr('y', d => yScale(d[1]))
                .attr('width', width / dataset.length)
                .attr('height', d => height - yScale(d[1]))
                .on('mouseover', function(event, d) {
                    const tooltip = d3.select('#tooltip');
                    tooltip.transition().duration(200).style('opacity', 0.9);
                    tooltip.html(`<strong>Date:</strong> ${d[0]}<br><strong>GDP:</strong> $${d[1]} Billion`)
                        .attr('data-date', d[0])
                        .style('left', `${event.pageX + 10}px`)
                        .style('top', `${event.pageY - 40}px`);
                })
                .on('mouseout', function() {
                    d3.select('#tooltip').transition().duration(500).style('opacity', 0);
                });
        });
});
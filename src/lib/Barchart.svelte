<!-- Men/women in numbers
<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    let data;

    onMount(async () => {
        try {
            const res = await fetch('/geslachtPerJaar.json');
            const jsonData = await res.json();

            data = jsonData;
            createChart();
        } catch (err) {
            console.error('Error loading JSON file:', err);
        }
    });

    const createChart = () => {
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 1200 - margin.left - margin.right;
        const height = 1600 - margin.top - margin.bottom;

        const svg = d3
            .select('#chart')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const years = Object.keys(data).reverse();

        const yScale = d3
            .scaleLinear()
            .domain([0, years.length - 1]) // Use a linear scale for the y-axis since it's a timeline
            .range([0, height]);

        const maxMen = d3.max(years.map((year) => data[year].men));
        const maxWomen = d3.max(years.map((year) => data[year].women));

        const xScale = d3
            .scaleLinear()
            .domain([-Math.max(maxMen, maxWomen), Math.max(maxMen, maxWomen)])
            .range([width / 2, 0]); // Adjusted range to be half of the width

        const colorScale = d3
            .scaleOrdinal()
            .domain(['men', 'women'])
            .range(['#0038a8', '#d60270']);

        // bars for men
        svg.selectAll('.barMen')
            .data(years)
            .enter()
            .append('rect')
            .attr('class', 'barMen')
            .attr('y', (year, index) => yScale(index))
            .attr('height', height / years.length) // Adjusted height calculation
            .attr('x', (year) =>
                data[year].men > 0 ? xScale(data[year].men) : xScale(0)
            )
            .attr('width', (year) =>
                Math.abs(xScale(data[year].men) - xScale(0))
            )
            .attr('fill', (year) => colorScale('men'));

        // bars for women
        svg.selectAll('.barWomen')
            .data(years)
            .enter()
            .append('rect')
            .attr('class', 'barWomen')
            .attr('y', (year, index) => yScale(index))
            .attr('height', height / years.length) // Adjusted height calculation
            .attr('x', (year) =>
                data[year].women < 0 ? xScale(data[year].women) : xScale(0)
            )
            .attr('width', (year) =>
                Math.abs(xScale(data[year].women) - xScale(0))
            )
            .attr('fill', (year) => colorScale('women'));
    };
</script> -->

<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    let data;
    let tooltip;

    onMount(async () => {
        try {
            const res = await fetch('/geslachtPerJaar.json');
            const jsonData = await res.json();

            data = jsonData;
            createChart();
        } catch (err) {
            console.error('Error loading JSON file:', err);
        }
    });

    const createChart = () => {
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 1200 - margin.left - margin.right;
        const height = 1600 - margin.top - margin.bottom;
        const tooltipSelection = d3.select(tooltip);

        const svg = d3
            .select('#chart')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const years = Object.keys(data).reverse();

        const yScale = d3
            .scaleLinear()
            .domain([0, years.length - 1])
            .range([0, height]);

        const maxMen = d3.max(years.map((year) => data[year].men));
        const maxWomen = d3.max(years.map((year) => data[year].women));

        const totalScale = d3
            .scaleLinear()
            .domain([0, Math.max(maxMen, maxWomen)])
            .range([0, width / 2]);

        const colorScale = d3
            .scaleOrdinal()
            .domain(['men', 'women'])
            .range(['#0038a8', '#d60270']);

        // bars for men
        svg.selectAll('.barMen')
            .data(years)
            .enter()
            .append('rect')
            .attr('class', 'barMen')
            .attr('y', (year, index) => yScale(index))
            .attr('height', height / years.length)
            .attr('x', (year) => {
                const percentage =
                    (data[year].men / (data[year].men + data[year].women)) *
                    100;
                return width / 2 - totalScale(percentage);
            })
            .attr('width', (year) => {
                const percentage =
                    (data[year].men / (data[year].men + data[year].women)) *
                    100;
                return totalScale(percentage);
            })
            .attr('fill', (year) => colorScale('men'));

        // bars for women
        svg.selectAll('.barWomen')
            .data(years)
            .enter()
            .append('rect')
            .attr('class', 'barWomen')
            .attr('y', (year, index) => yScale(index))
            .attr('height', height / years.length)
            .attr('x', width / 2)
            .attr('width', (year) => {
                const percentage =
                    (data[year].women / (data[year].men + data[year].women)) *
                    100;
                return totalScale(percentage);
            })
            .attr('fill', (year) => colorScale('women'));

        // axes
        const maxAxisWidth = 285;
        const domainValues = [0, 100];

        const percentageScale = d3
            .scaleLinear()
            .domain([domainValues[0], domainValues[1]])
            .range([0, Math.min(width / 2, maxAxisWidth)]);

        // men axis
        const menPercentageAxis = d3
            .axisTop(percentageScale.copy().domain(domainValues.reverse()))
            .ticks(5)
            .tickFormat((d) => `${d}%`);

        svg.append('g')
            .attr('class', 'men-percentage-axis')
            .attr('transform', `translate(${width / 4}, 0)`)
            .call(menPercentageAxis);

        // women axis
        const womenPercentageAxis = d3
            .axisTop(percentageScale)
            .ticks(5)
            .tickFormat((d) => `${d}%`);

        svg.append('g')
            .attr('class', 'women-percentage-axis')
            .attr('transform', `translate(${width / 2}, 0)`)
            .call(womenPercentageAxis);

        // tooltip
        const bars = svg.selectAll('.barMen, .barWomen');

        bars.on('mouseover', (event, d) => {
            const percentage = calculatePercentage(d);
            const xPos = event.pageX;
            const yPos = event.pageY;

            bars.style('opacity', 0.4);
            d3.select(event.currentTarget).style('opacity', 1);

            tooltipSelection
                .style('opacity', 1)
                .html(`<strong>${d}</strong><br>${percentage}%`)
                .style('left', `${xPos}px`)
                .style('top', `${yPos}px`);
        });

        bars.on('mouseout', () => {
            bars.style('opacity', 1);
            tooltipSelection.style('opacity', 0);
        });

        // year labels
        svg.selectAll('.year-label')
            .data(years)
            .enter()
            .append('text')
            .attr('class', 'year-label')
            .attr('x', width / 2)
            .attr('y', (year, index) => yScale(index) + 6)
            .text((year) => year)
            .style('text-anchor', 'middle')
            .style('font-size', '0.4rem');
    };
    // prettier-ignore
    const calculatePercentage = (year) => {
        const menPercentage = (data[year].men / (data[year].men + data[year].women)) * 100;
        const womenPercentage = (data[year].women / (data[year].men + data[year].women)) * 100;

        return `Men: ${menPercentage.toFixed(2)}%, Women: ${womenPercentage.toFixed(2)}`;
    };
</script>

<div id="chart" />
<div id="tooltip" bind:this={tooltip} class="tooltip" />

<style>
    .barMen,
    .barWomen {
        stroke: none;
    }

    .tooltip {
        position: absolute;
        background-color: #fff;
        border: 1px solid #ddd;
        padding: 10px;
        opacity: 0;
        pointer-events: none;
        z-index: 999;
    }
</style>

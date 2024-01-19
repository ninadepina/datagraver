<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    let data;

    onMount(async () => {
        try {
            const res = await fetch('/linksrechts.json');
            const jsonData = await res.json();

            data = jsonData;
            drawStackedBarCharts();
        } catch (err) {
            console.error('Error loading JSON file:', err);
        }
    });

    const drawStackedBarCharts = () => {
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };
        const width = 1200 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3
            .select('#chart-container')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const years = data.map((d) => d.Start_year);
        const parties = Array.from(
            new Set(
                data.reduce(
                    (allParties, d) =>
                        allParties.concat(
                            d.Parties_left.map((party) => party.Party),
                            d.Parties_right.map((party) => party.Party)
                        ),
                    []
                )
            )
        );

        const xScale = d3
            .scaleBand()
            .domain(years)
            .range([0, width])
            .padding(0.1);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.Left + d.Right)])
            .range([height, 0]);

        const colorScale = d3
            .scaleOrdinal()
            .domain(parties)
            .range(d3.schemeSet3);

        const stackedBars = svg
            .selectAll('.stacked-bar-group')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'stacked-bar-group')
            .attr('transform', (d) => `translate(${xScale(d.Start_year)}, 0)`);

        stackedBars
            .selectAll('rect')
            .data((d) => {
                let cumulativeSeats = 0;
                return [...d.Parties_left, ...d.Parties_right].map((party) => {
                    cumulativeSeats += party.Seats;
                    return { ...party, cumulativeSeats };
                });
            })
            .enter()
            .append('rect')
            .attr('x', (d) => xScale.bandwidth() / 2 - 10)
            .attr('y', (d) => yScale(d.cumulativeSeats))
            .attr('height', (d) => height - yScale(d.Seats))
            .attr('width', 20)
            .attr('fill', (d) => colorScale(d.Party));

        const xAxis = d3.axisBottom(xScale);
        svg.append('g').attr('transform', `translate(0,${height})`).call(xAxis);

        const yAxis = d3.axisLeft(yScale);
        svg.append('g').call(yAxis);
    }
</script>

<div id="chart-container" />

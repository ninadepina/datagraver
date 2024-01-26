<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    let data;
    let tooltip;

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
        const margin = { top: 20, right: 30, bottom: 30, left: 30 };
        const width = 1610 - margin.left - margin.right;
        const height = 275 - margin.top - margin.bottom;

        const svg = d3
            .select('#chart-container-left')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const years = Array.from(
            new Set(
                data.flatMap((d) => {
                    const startYear = d.Start_year;
                    const endYear = d.End_year;

                    const yearsInRange = Array.from(
                        { length: endYear - startYear + 1 },
                        (_, i) => startYear + i
                    );

                    return [startYear, ...yearsInRange, endYear];
                })
            )
        );

        const parties = Array.from(
            new Set(
                data.reduce(
                    (allParties, d) =>
                        allParties.concat(
                            d.Parties_left.map((party) => party.Party)
                        ),
                    []
                )
            )
        );

        const totalSeatsByYear = years.map((year) =>
            data
                .filter((d) => d.Start_year <= year && d.End_year >= year)
                .reduce((total, d) => total + d.Right, 0)
        );

        const xScale = d3
            .scaleBand()
            .domain(years)
            .range([0, width])
            .padding(0.1);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(totalSeatsByYear)])
            .range([height, 0]);

        const colorScale = d3
            .scaleOrdinal()
            .domain([
                'GL-PvdA',
                'D66',
                'SP',
                'PvdD',
                'DENK',
                'Volt',
                'BIJ1',
                'GL',
                'PvdA',
                'PPR',
                'PSP',
                'CPN',
                'EVP',
                "DS'70",
                'SDAP',
                'VDB',
                'CDU',
                'CPH',
                'RSP',
                'RKVP',
                'CPH-De Visser',
                'CPH-Wijnkoop',
                'Liberale Partij',
                'Neutrale Partij',
                'CSP',
                'BCS',
                'CDP',
                'Middenstandspartij',
                'SDP',
                'EB',
                'BVL',
                'onafhankelijk c.h.',
                'vrije socialist',
                'vrije Liberalen',
                'CH Kiezersbond',
                'onafhankelijk a.r.'
            ])
            .range([
                'brown', // GL-PvdA
                '#38A93E', // D66
                '#E61B23', // SP
                '#1F682B', // PvdD
                '#38B1AC', // DENK
                '#5C278A', // Volt
                '#F7F702', // BIJ1
                '#38AA32', // GL
                '#DE0B2D', // PvdA
                '#2C429E', // PPR
                '#F4212C', // PSP
                'orange', // CPN
                '#7B2C63', // EVP
                '#E60C20', // DS'70
                '#CA2714', // SDAP
                '#B3B3B3', // VDB
                'navy', // CDU
                'maroon', // CPH
                'salmon', // RSP
                '#C63D1A', // RKVP
                'lavender', // CPH-De Visser
                'plum', // CPH-Wijnkoop
                'turquoise', // Liberale Partij
                'violet', // Neutrale Partij
                'sienna', // CSP
                'slategray', // BCS
                'peru', // CDP
                'darkgreen', // Middenstandspartij
                'darkred', // SDP
                'darkcyan', // EB
                'darkslateblue', // BVL
                'rosybrown', // onafhankelijk c.h.
                'lightcoral', // vrije socialist
                'mediumorchid', // vrije Liberalen
                'darkorange', // CH Kiezersbond
                'indianred' // onafhankelijk a.r.
            ]);

        years.forEach((year) => {
            const stackedBars = svg
                .selectAll(`.stacked-bar-group-left-${year}`)
                .data(
                    data.filter(
                        (d) => d.Start_year <= year && d.End_year >= year
                    )
                )
                .enter()
                .append('g')
                .attr('class', `stacked-bar-group-left-${year}`)
                .attr('transform', (d) => `translate(${xScale(year)}, 0)`);

            stackedBars
                .selectAll('rect')
                .data((d) => {
                    let cumulativeSeats = 0;
                    return d.Parties_left.map((party) => {
                        const seats = party.Seats;
                        cumulativeSeats += seats;
                        return { ...party, seats, cumulativeSeats };
                    });
                })
                .enter()
                .append('rect')
                .attr('x', (d) => xScale.bandwidth() / 2 - 10)
                .attr('y', (d) =>
                    yScale(
                        (d.cumulativeSeats / (year <= 1955 ? 100 : 150)) * 100
                    )
                )
                .attr(
                    'height',
                    (d) =>
                        height -
                        yScale((d.seats / (year <= 1955 ? 100 : 150)) * 100)
                )
                .attr('width', 13)
                .attr('fill', (d) => colorScale(d.Party))
                .on('mouseover', (event, d) => showTooltip(event, d))
                .on('mouseout', () => hideTooltip());
        });

        // const xAxis = d3.axisBottom(xScale);
        // svg.append('g').attr('transform', `translate(0,${height})`).call(xAxis);

        // const yAxis = d3.axisLeft(yScale);
        // svg.append('g').call(yAxis);
    };

    const showTooltip = (event, data) => {
        const tooltipContent = `${data.Party}: ${data.seats} seats`;
        d3.select(tooltip)
            .html(tooltipContent)
            .style('left', event.pageX + 'px')
            .style('top', event.pageY - 28 + 'px')
            .style('opacity', 1);
    };

    const hideTooltip = () => {
        d3.select(tooltip).style('opacity', 0);
    };
</script>

<div id="chart-container-left" />
<div id="tooltip" bind:this={tooltip} class="tooltip" />

<style>
    .tooltip {
        opacity: 0;
        position: absolute;
        padding: 10px;
        background-color: #fff;
        border: 1px solid #ddd;
        pointer-events: none;
        z-index: 999;
    }
</style>

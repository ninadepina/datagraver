<!-- <script>
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
        const width = 2400 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3
            .select('#chart-container')
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
                            d.Parties_left.map((party) => party.Party),
                            d.Parties_right.map((party) => party.Party)
                        ),
                    []
                )
            )
        );

        const totalSeatsByYear = years.map((year) =>
            data
                .filter((d) => d.Start_year <= year && d.End_year >= year)
                .reduce((total, d) => total + d.Left + d.Right, 0)
        );

        const xScale = d3
            .scaleBand()
            .domain(years)
            .range([0, width])
            .padding(0.1);

        const yScale = d3
            .scaleLinear()
            .domain([0, 100])
            .range([height, 0]);

        const colorScale = d3
            .scaleOrdinal()
            .domain(parties)
            .range(d3.schemeSet3);

        years.forEach((year) => {
            const stackedBars = svg
                .selectAll(`.stacked-bar-group-${year}`)
                .data(data.filter((d) => d.Start_year <= year && d.End_year >= year))
                .enter()
                .append('g')
                .attr('class', `stacked-bar-group-${year}`)
                .attr('transform', (d) => `translate(${xScale(year)}, 0)`);
            // prettier-ignore
            stackedBars
                .selectAll('rect')
                .data((d) => {
                    let cumulativePercentage = 0;
                    return [...d.Parties_left, ...d.Parties_right].map((party) => {
                        const percentage =
                            (party.Seats / totalSeatsByYear[years.indexOf(year)]) * 100;
                        cumulativePercentage += percentage;
                        return { ...party, percentage, cumulativePercentage };
                    });
                })
                .enter()
                .append('rect')
                .attr('x', (d) => xScale.bandwidth() / 2 - 10)
                .attr('y', (d) => yScale(d.cumulativePercentage))
                .attr('height', (d) => height - yScale(d.percentage))
                .attr('width', 20)
                .attr('fill', (d) => colorScale(d.Party));
        });

        const xAxis = d3.axisBottom(xScale);
        svg.append('g').attr('transform', `translate(0,${height})`).call(xAxis);

        const yAxis = d3.axisLeft(yScale).tickFormat((d) => `${d}%`);
        svg.append('g').call(yAxis);
    };
</script>

<div id="chart-container" /> -->

<!-- <script>
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
        const width = 2400 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3
            .select('#chart-container')
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
                            d.Parties_left.map((party) => party.Party),
                            d.Parties_right.map((party) => party.Party)
                        ),
                    []
                )
            )
        );

        const totalSeatsByYear = years.map((year) =>
            data
                .filter((d) => d.Start_year <= year && d.End_year >= year)
                .reduce((total, d) => total + d.Left + d.Right, 0)
        );

        const xScale = d3
            .scaleBand()
            .domain(years)
            .range([0, width])
            .padding(0.1);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(totalSeatsByYear)]) // Adjusted to use seat values
            .range([height, 0]);

        const colorScale = d3
            .scaleOrdinal()
            .domain(parties)
            .range(d3.schemeSet3);

        years.forEach((year) => {
            const stackedBars = svg
                .selectAll(`.stacked-bar-group-${year}`)
                .data(data.filter((d) => d.Start_year <= year && d.End_year >= year))
                .enter()
                .append('g')
                .attr('class', `stacked-bar-group-${year}`)
                .attr('transform', (d) => `translate(${xScale(year)}, 0)`);
            // prettier-ignore
            stackedBars
                .selectAll('rect')
                .data((d) => {
                    let cumulativeSeats = 0;
                    return [...d.Parties_left, ...d.Parties_right].map((party) => {
                        const seats = party.Seats;
                        cumulativeSeats += seats;
                        return { ...party, seats, cumulativeSeats };
                    });
                })
                .enter()
                .append('rect')
                .attr('x', (d) => xScale.bandwidth() / 2 - 10)
                .attr('y', (d) => yScale(d.cumulativeSeats))
                .attr('height', (d) => height - yScale(d.seats))
                .attr('width', 20)
                .attr('fill', (d) => colorScale(d.Party));
        });

        const xAxis = d3.axisBottom(xScale);
        svg.append('g').attr('transform', `translate(0,${height})`).call(xAxis);

        const yAxis = d3.axisLeft(yScale);
        svg.append('g').call(yAxis);
    };
</script>

<div id="chart-container" /> -->

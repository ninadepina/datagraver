<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    let data;

    onMount(async () => {
        try {
            const res = await fetch('/linksrechts.json');
            const jsonData = await res.json();

            data = jsonData;
            createChart();
        } catch (err) {
            console.error('Error loading JSON file:', err);
        }
    });

    const createChart = () => {
        const margin = { top: 20, right: 30, bottom: 30, left: 30 };
        const width = 500 - margin.left - margin.right;
        const height = 1600 - margin.top - margin.bottom;

        const svg = d3
            .select('#chart')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // years
        const allYears = Array.from(
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

        // axes
        const xScaleRight = d3
            .scaleLinear()
            .domain([0, 100])
            .range([0, width / 2]);

        const xScaleLeft = d3
            .scaleLinear()
            .domain([100, 0])
            .range([0, width / 2]);

        const yScale = d3
            .scaleBand()
            .domain(allYears)
            .range([height, 0])
            .padding(-0.04);

        // parties
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

        // all data
        const expandedData = data.flatMap((d) => {
            const startYear = d.Start_year;
            const endYear = d.End_year;

            const yearsInRange = Array.from(
                { length: endYear - startYear + 1 },
                (_, i) => startYear + i
            );

            return yearsInRange.map((year) => ({
                year,
                Left: d.Left,
                Right: d.Right,
                Parties_left: d.Parties_left,
                Parties_right: d.Parties_right
            }));
        });

        // scales
        const totalScale = d3
            .scaleLinear()
            .domain([0, d3.max(expandedData, (d) => d.Left + d.Right)])
            .range([0, width / 2]);

        const totalScaleAdjusted = d3
            .scaleLinear()
            .domain([0, d3.max(expandedData, (d) => d.Left + d.Right)])
            .range([0, (width / 2) * (150 / 100)]);

        const ranges = data.map((d) => ({
            start: d.Start_year,
            end: d.End_year
        }));
        // prettier-ignore
        const alternateColor = (year, isLeft) => {
            let currentRangeIndex = 0;

            for (let i = 0; i < ranges.length; i++) {
                if (year >= ranges[i].start && year <= ranges[i].end) {
                    currentRangeIndex = i;
                    break;
                }
            }

            let baseColor = currentRangeIndex % 2 === 0 ? '#eed2e9' : '#c2a1bf';

            return isLeft
                ? (baseColor = currentRangeIndex % 2 === 0 ? '#d7e3e8' : '#a1b8c2')
                : baseColor;
        };

        // prettier-ignore
        svg.selectAll('.barLeft')
            .data(expandedData)
            .enter()
            .append('rect')
            .attr('class', 'barLeft')
            .attr('x', (d) => d.year >= 1901 && d.year <= 1955 ? width / 2 - totalScaleAdjusted(d.Left) : width / 2 - totalScale(d.Left))
            .attr('y', (d) => yScale(d.year) + 10)
            .attr('width', (d) => d.year >= 1901 && d.year <= 1955 ? totalScaleAdjusted(d.Left) : totalScale(d.Left))
            .attr('height', yScale.bandwidth())
            .style('fill', (d) => {
                const color = alternateColor(d.year, true);

                // logging seats just to check
                let cumulativeSeats = 0;
                const partiesLeft = d.Parties_left.map((party) => {
                    cumulativeSeats += party.Seats;
                    console.log('Left Bar - Year:', d.year, 'Party:', party.Party, 'Seats:', party.Seats);
                    return { ...party, cumulativeSeats };
                });

                return color;
            });
        // prettier-ignore
        svg.selectAll('.barRight')
            .data(expandedData)
            .enter()
            .append('rect')
            .attr('class', 'barRight')
            .attr('x', (d) => d.year >= 1901 && d.year <= 1955 ? width / 2 : width / 2)
            .attr('y', (d) => yScale(d.year) + 10)
            .attr('width', (d) => d.year >= 1901 && d.year <= 1955 ? totalScaleAdjusted(d.Right) : totalScale(d.Right))
            .attr('height', yScale.bandwidth())
            .style('fill', (d) => {
                const color = alternateColor(d.year, false);

                // logging seats just to check
                let cumulativeSeats = 0;
                const partiesRight = d.Parties_right.map((party) => {
                    cumulativeSeats += party.Seats;
                    console.log('Right Bar - Year:', d.year, 'Party:', party.Party, 'Seats:', party.Seats);
                    return { ...party, cumulativeSeats };
                });

                return color;
            });

        svg.selectAll('.line')
            .data(allYears)
            .enter()
            .filter((year) => {
                return !data.some(
                    (d) => d.Start_year === year || d.End_year === year
                );
            })
            .append('line')
            .attr('class', 'line')
            .attr('x1', width / 2)
            .attr('x2', width / 2)
            .attr('y1', (year) => yScale(year) + 10)
            .attr('y2', (year) => yScale(year) + yScale.bandwidth() + 10)
            .style('stroke', 'black');

        // x axes
        svg.append('g')
            .attr('transform', 'translate(0,0)')
            .call(
                d3
                    .axisTop(xScaleLeft)
                    .ticks(5)
                    .tickSizeOuter(0)
                    .tickFormat((d) => `${d}%`)
            );

        svg.append('g')
            .attr('transform', `translate(${width / 2}, 0)`)
            .call(
                d3
                    .axisTop(xScaleRight)
                    .ticks(5)
                    .tickSizeOuter(0)
                    .tickFormat((d) => `${d}%`)
            );

        // y axis
        const yAxis = svg
            .append('g')
            .attr('transform', `translate(${width / 2}, 0)`)
            .call(
                d3
                    .axisLeft(yScale)
                    .tickSize(0)
                    .tickValues(
                        allYears.filter((year) => {
                            return data.some(
                                (d) =>
                                    d.Start_year === year || d.End_year === year
                            );
                        })
                    )
            );

        yAxis.select('.domain').remove();

        yAxis
            .selectAll('.tick text')
            .attr('x', 0)
            .attr('dy', yScale.bandwidth() / 2 + 7)
            .style('text-anchor', 'middle');
    };
</script>

<div id="chart" />

<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    import ManWoman from '$lib/ManWoman.svelte';

    let data;
    let yearData;
    let tooltip;

    onMount(async () => {
        try {
            const [res1, res2] = await Promise.all([
                fetch('/geslachtPerJaar.json'),
                fetch('/linksrechts.json')
            ]);

            const jsonData = await res1.json();
            const jsonData2 = await res2.json();

            data = jsonData;
            yearData = jsonData2;
            createChart();
        } catch (err) {
            console.error('Error loading JSON file:', err);
        }
    });

    const createChart = () => {
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 940 - margin.left - margin.right;
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

        // years
        let allYears = Array.from(
            new Set(
                yearData.flatMap((d) => {
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
        allYears = allYears.reverse();

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

        const ranges = yearData.map((d) => ({
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

            let baseColor = currentRangeIndex % 2 === 0 ? '#d6cae0' : '#b4a1c2';

            return isLeft
                ? (baseColor = currentRangeIndex % 2 === 0 ? '#cadec8' : '#a5c2a1')
                : baseColor;
        };

        // bars for men
        svg.selectAll('.barMen')
            .data(years)
            .enter()
            .append('rect')
            .attr('class', (year, d) => `barMen men-${year} ${d}`)
            .attr('y', (year, index) => yScale(index) + 9)
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
            .style('fill', (d) => {
                const color = alternateColor(d, true);
                return color;
            });

        // bars for women
        svg.selectAll('.barWomen')
            .data(years)
            .enter()
            .append('rect')
            .attr('class', (year) => `barWomen women-${year}`)
            .attr('y', (year, index) => yScale(index) + 9)
            .attr('height', height / years.length)
            .attr('x', width / 2)
            .attr('width', (year) => {
                const percentage =
                    (data[year].women / (data[year].men + data[year].women)) *
                    100;
                return totalScale(percentage);
            })
            .style('fill', (d) => {
                const color = alternateColor(d, false);
                return color;
            });

        // axes
        const maxAxisWidth = 220;
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

        let color;
        let menBar;
        let womenBar;

        bars.on('mouseover', (e, d) => {
            const percentage = calculatePercentage(d);
            const xPos = e.offsetX + 20;
            let yPos = e.offsetY + 20;

            const tooltipHeight = tooltipSelection.node().offsetHeight;
            if (window.innerHeight - (e.clientY + tooltipHeight) < 100) {
                yPos = e.offsetY - 140;
            }

            const classes = e.currentTarget.classList[1];
            const parts = classes.split('-');

            const yearBars = svg.selectAll(
                `.men-${parts[1]}, .women-${parts[1]}`
            );

            color = alternateColor(`${parts[1]}`, true);

            menBar = svg.select(`.men-${parts[1]}`);
            menBar.style('fill', '#a5c2a1');
            womenBar = svg.select(`.women-${parts[1]}`);
            womenBar.style('fill', '#b4a1c2');

            bars.style('opacity', 0.4);
            yearBars.style('opacity', 1);

            tooltipSelection
                .style('opacity', 1)
                .html(`<strong>${d}</strong><br>${percentage}%`)
                .style('left', `${xPos}px`)
                .style('top', `${yPos}px`);
        });

        bars.on('mouseout', () => {
            if (color === '#cadec8') {
                menBar.style('fill', '#cadec8');
                womenBar.style('fill', '#d6cae0');
            }
            bars.style('opacity', 1);
            tooltipSelection.style('opacity', 0);
        });

        // year labels
        svg.selectAll('.year-label')
            .data(allYears)
            .enter()
            .append('text')
            .attr('class', 'year-label')
            .attr('x', width / 2)
            .attr('y', (year, index) => yScale(index) + 19)
            .text((year) => {
                const isStartYear = yearData.some((d) => d.Start_year === year);
                const isEndYear = yearData.some((d) => d.End_year === year);

                return isStartYear || isEndYear ? year : '';
            })
            .style('text-anchor', 'middle')
            .style('font-size', '0.625rem');

        svg.selectAll('.vertical-line')
            .data(allYears)
            .enter()
            .append('line')
            .attr('class', 'vertical-line')
            .attr('x1', width / 2)
            .attr('x2', width / 2)
            .attr('y1', (year, index) => yScale(index) + 9)
            .attr(
                'y2',
                (year, index) => yScale(index) + height / years.length + 9
            )
            .style('stroke', '#000')
            .style('opacity', (year) => {
                const isStartYear = yearData.some((d) => d.Start_year === year);
                const isEndYear = yearData.some((d) => d.End_year === year);

                return isStartYear || isEndYear ? 0 : 1;
            });
    };
    // prettier-ignore
    const calculatePercentage = (year) => {
        const menPercentage = (data[year].men / (data[year].men + data[year].women)) * 100;
        const womenPercentage = (data[year].women / (data[year].men + data[year].women)) * 100;

        return `Men: ${menPercentage.toFixed(2)}%, Women: ${womenPercentage.toFixed(2)}`;
    };
</script>

<section>
    <div id="chart" />
    <div id="tooltip" bind:this={tooltip} class="tooltip" />

    <ManWoman />
</section>

<style>
    #chart {
        min-width: 940px;
    }

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

    section {
        position: relative;
    }
</style>

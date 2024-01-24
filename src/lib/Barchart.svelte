<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    // components right side
    import Kostic from '$lib/comp_periods/Kostic.svelte';
    import Jeltje from '$lib/comp_periods/Jeltje.svelte';
    import Verdrag from '$lib/comp_periods/Verdrag.svelte';
    import Golf from '$lib/comp_periods/Golf.svelte';
    import Marga from '$lib/comp_periods/Marga.svelte';
    import WW2 from '$lib/comp_periods/WW2_3.svelte';
    import Actief from '$lib/comp_periods/1919.svelte';
    import Suze from '$lib/comp_periods/Suze.svelte';
    import Passief from '$lib/comp_periods/1917.svelte';

    // components left side
    import Streefcijfer from './comp_periods/Streefcijfer.svelte';
    import Kieswet from './comp_periods/Kieswet.svelte';
    import WW2_2 from './comp_periods/WW2_4.svelte';
    import MeToo from './comp_moments/MeToo.svelte';
    import Abortus from './comp_moments/Abortus2.svelte';
    import Emancipatie from './comp_moments/Emancipatie.svelte';
    import Plicht from './comp_moments/Plicht.svelte';
    import UVRM from './comp_moments/UVRM.svelte';
    import Drucker from './comp_moments/Drucker.svelte';
    import Plicht2 from './comp_moments/Plicht2.svelte';

    let data;
    let yearData;
    let tooltip;

    onMount(async () => {
        try {
            const res = await fetch('/geslachtPerJaar.json');
            const jsonData = await res.json();

            const res2 = await fetch('/linksrechts.json');
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
            // console.log(currentRangeIndex);
            let baseColor = currentRangeIndex % 2 === 0 ? '#d60270' : '#d60270';

            return isLeft
                ? (baseColor = currentRangeIndex % 2 === 0 ? '#0038a8' : '#0038a8')
                : baseColor;
        };

        // bars for men
        svg.selectAll('.barMen')
            .data(years)
            .enter()
            .append('rect')
            .attr('class', 'barMen')
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
            .attr('class', 'barWomen')
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

    <article id="article_one">
        <Kostic />
    </article>

    <article id="article_two">
        <Jeltje />
    </article>

    <article id="article_three">
        <Verdrag />
    </article>

    <article id="article_four">
        <Golf />
    </article>

    <article id="article_five">
        <Marga />
    </article>

    <article id="article_six">
        <WW2 />
    </article>

    <article id="article_seven">
        <Actief />
    </article>

    <article id="article_eight">
        <Suze />
    </article>

    <article id="article_nine">
        <Passief />
    </article>

    <article id="article_ten">
        <Streefcijfer />
    </article>

    <article id="article_eleven">
        <Kieswet />
    </article>

    <article id="article_twelve">
        <WW2_2 />
    </article>

    <span id="span_one">
        <MeToo />
    </span>

    <span id="span_two">
        <Abortus />
    </span>

    <span id="span_three">
        <Emancipatie />
    </span>

    <span id="span_four">
        <Plicht />
    </span>

    <span id="span_five">
        <UVRM />
    </span>

    <span id="span_six">
        <Drucker />
    </span>

    <span id="span_seven">
        <Plicht2 />
    </span>
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

    article,
    span {
        position: absolute;
    }
    /* articles 1 to 9 */
    article:nth-of-type(n + 1):nth-of-type(-n + 9) {
        right: -9.9rem;
    }
    /* articles 10 and beyond */
    article:nth-of-type(n + 10) {
        left: -1.5rem;
    }

    #article_one {
        top: -0.85rem;
    }

    #article_two {
        top: 12.5rem;
    }

    #article_three {
        top: 25.8rem;
    }

    #article_four {
        top: 37.5rem;
    }

    #article_five {
        top: 46.2rem;
    }

    #article_six {
        top: 57.9rem;
    }

    #article_seven {
        top: 72.7rem;
    }

    #article_eight {
        top: 80.2rem;
    }

    #article_nine {
        top: 89rem;
    }

    #article_ten {
        top: 10.6rem;
    }

    #article_eleven {
        top: 22rem;
    }

    #article_twelve {
        top: 62.5rem;
    }

    #span_one {
        top: 4.7rem;
        left: 4.65rem;
    }

    #span_two {
        top: 33rem;
        left: 3.15rem;
    }

    #span_three {
        top: 38.3rem;
        left: 0rem;
    }

    #span_four {
        top: 46.5rem;
        left: -1.8rem;
    }

    #span_five {
        top: 56.45rem;
        left: -0.75rem;
    }

    #span_six {
        top: 79.58rem;
        left: -3.7rem;
    }

    #span_seven {
        top: 88.67rem;
        left: -1.4rem;
    }
</style>

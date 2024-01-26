<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    // components right side
    import Corona from '$lib/comp_periods/Corona.svelte';
    import Kredietcrisis from '$lib/comp_periods/Kredietcrisis.svelte';
    import Fortuyn from '$lib/comp_periods/Fortuyn.svelte';
    import Oliecrisis from '$lib/comp_periods/Oliecrisis.svelte';
    import Watersnoodramp from '$lib/comp_periods/Watersnoodramp.svelte';
    import WW2 from '$lib/comp_periods/WW2.svelte';
    import Economie from '$lib/comp_periods/Economie.svelte';
    import Na1918 from '$lib/comp_periods/Na1918.svelte';
    import Voor1918 from '$lib/comp_periods/Voor1918.svelte';

    // components left side
    import Gijzeling from '$lib/comp_periods/Gijzeling.svelte';
    import WW2_2 from '$lib/comp_periods/WW2_2.svelte';
    import Toeslagen from '$lib/comp_moments/Toeslagen.svelte';
    import Oorlog from '$lib/comp_moments/Oorlog.svelte';
    import Fortuyn2 from '$lib/comp_moments/Fortuyn.svelte';
    import Twintowers from '$lib/comp_moments/Twintowers.svelte';
    import Abortus from '$lib/comp_moments/Abortus.svelte';
    import Plicht from '$lib/comp_moments/Plicht.svelte';
    import Ramp from '$lib/comp_moments/Ramp.svelte';
    import Actief from '$lib/comp_moments/Actief.svelte';
    import Passief from '$lib/comp_moments/Passief.svelte';

    let data;
    let tooltip;

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
        const tooltipSelection = d3.select(tooltip);

        const svg = d3
            .select('#chart')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const colorScaleData = {
            'GL-PvdA': 'brown',
            D66: '#38A93E',
            SP: '#E61B23',
            PvdD: '#1F682B',
            DENK: '#38B1AC',
            Volt: '#5C278A',
            BIJ1: '#F7F702',
            GL: '#38AA32',
            PvdA: '#DE0B2D',
            PPR: '#2C429E',
            PSP: '#F4212C',
            CPN: 'orange',
            EVP: '#7B2C63',
            "DS'70": '#E60C20',
            SDAP: '#CA2714',
            VDB: '#B3B3B3',
            CDU: 'navy',
            CPH: 'maroon',
            RSP: 'salmon',
            RKVP: '#C63D1A',
            'CPH-De Visser': 'lavender',
            'CPH-Wijnkoop': 'plum',
            'Liberale Partij': 'turquoise',
            'Neutrale Partij': 'violet',
            CSP: 'sienna',
            BCS: 'slategray',
            CDP: 'peru',
            Middenstandspartij: 'darkgreen',
            SDP: 'darkred',
            EB: 'darkcyan',
            BVL: 'darkslateblue',
            'onafhankelijk c.h.': 'rosybrown',
            'vrije socialist': 'lightcoral',
            'vrije Liberalen': 'mediumorchid',
            'CH Kiezersbond': 'darkorange',
            'onafhankelijk a.r.': 'indianred',
            PVV: '#184673',
            FvD: '#A5191B',
            VVD: '#F66303',
            CDA: '#44C94B',
            CU: '#30A5E8',
            SGP: '#EA5D05',
            NSC: '#131239',
            BBB: '#97C218',
            JA21: '#E01A14',
            '50PLUS': '#932290',
            LPF: '#F9D846',
            Leefbaar: '#447937',
            GPV: '#F77608',
            RPF: '#8CE1B8',
            'UNIE 55+': '#FCCE48',
            CD: '#F44A29',
            AOV: '#1C559F',
            CP: '#F1EC88',
            BP: 'maroon',
            RKPN: '#DABD2D',
            CHU: '#393B8B',
            ARP: '#9B2B93',
            KVP: '#FDE24C',
            PSP: '#F42630',
            NMP: '#E1CAA0',
            KNP: 'darkslategray',
            'Lijst Welter': 'firebrick',
            PvdV: 'tomato',
            LSP: 'gold',
            NSB: 'darkred',
            RKSP: 'sienna',
            VNH: 'darkkhaki',
            HGSP: 'mediumvioletred',
            NBTM: 'darkcyan',
            Vrijheidsbond: 'darkgreen',
            Plattelandersbond: 'olivedrab',
            'MP S&L': 'lightseagreen',
            RK: 'saddlebrown',
            VDW: 'darkviolet',
            LU: 'peru',
            AB: 'darkslategray',
            'Bond van Vrije Liberalen': 'gold',
            'Friese Bond': 'mediumspringgreen',
            CHP: 'indianred',
            VAR: 'lightslategray',
            katholieken: 'darkorange'
        };

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

        // hover effect
        const bars = svg.selectAll('.barLeft, .barRight');

        const handleHover = (e, year) => {
            const currentRange = data.find(
                (d) => year >= d.Start_year && year <= d.End_year
            );

            bars.style('opacity', (d) => {
                const isInPeriod =
                    currentRange &&
                    d.year >= currentRange.Start_year &&
                    d.year <= currentRange.End_year;
                return isInPeriod || d.year === year ? 0 : 1;
            });

            if (currentRange) {
                const xPos = e.offsetX + 20;
                let yPos = e.offsetY + 20;

                const tooltipHeight = tooltipSelection.node().offsetHeight;
                if (yPos + tooltipHeight > 1550) {
                    yPos = e.offsetY - 140;
                }

                const totalSeats = currentRange.Left + currentRange.Right;

                const partiesLeftList = currentRange.Parties_left.map(
                    ({ Party, Seats }) =>
                        `<span style="--color: ${
                            colorScaleData[Party] || 'red'
                        }; white-space: nowrap;" class="party-item">${Party}: ${Seats}</span>`
                ).join('<br>');

                const partiesRightList = currentRange.Parties_right.map(
                    ({ Party, Seats }) =>
                        `<span style="--color: ${
                            colorScaleData[Party] || 'red'
                        }; white-space: nowrap;" class="party-item">${Party}: ${Seats}</span>`
                ).join('<br>');

                tooltipSelection
                    .style('opacity', 1)
                    .html(
                        `   <div class="ttip">
                                <p style="white-space: nowrap; margin-bottom: 0.25rem;"><strong>Totaal:</strong> ${totalSeats} zetels</p>
                                <div style="display: flex; flex-direction: row; gap: 1rem;">
                                    <div class="party-list">
                                        <strong style="white-space: nowrap; margin-bottom: 0.2rem;">Links (${currentRange.Left}):</strong><br>${partiesLeftList}
                                    </div>
                                    <div class="party-list">
                                        <strong style="white-space: nowrap; margin-bottom: 0.2rem;">Rechts (${currentRange.Right}):</strong><br>${partiesRightList}
                                    </div>  
                                </div>
                            </div>
                        `
                    )
                    .style('position', `absolute`)
                    .style('left', `${xPos}px`)
                    .style('top', `${yPos}px`);
            } else {
                tooltipSelection.style('opacity', 0);
            }
        };

        bars.on('mouseover', (e, d) => handleHover(e, d.year)).on(
            'mouseout',
            () => {
                bars.style('opacity', 1);
                tooltipSelection.style('opacity', 0);
            }
        );
    };
</script>

<section>
    <div id="chart" />
    <div id="tooltip" bind:this={tooltip} class="tooltip" />

    <article id="article_one">
        <Corona />
    </article>

    <article id="article_two">
        <Kredietcrisis />
    </article>

    <article id="article_three">
        <Fortuyn />
    </article>

    <article id="article_four">
        <Oliecrisis />
    </article>

    <article id="article_five">
        <Watersnoodramp />
    </article>

    <article id="article_six">
        <WW2 />
    </article>

    <article id="article_seven">
        <Economie />
    </article>

    <article id="article_eight">
        <Na1918 />
    </article>

    <article id="article_nine">
        <Voor1918 />
    </article>

    <article id="article_ten">
        <Gijzeling />
    </article>

    <article id="article_eleven">
        <WW2_2 />
    </article>

    <span id="span_one">
        <Toeslagen />
    </span>

    <span id="span_two">
        <Oorlog />
    </span>

    <span id="span_three">
        <Fortuyn2 />
    </span>

    <span id="span_four">
        <Twintowers />
    </span>

    <span id="span_five">
        <Abortus />
    </span>

    <span id="span_six">
        <Plicht />
    </span>

    <span id="span_seven">
        <Ramp />
    </span>

    <span id="span_eight">
        <Actief />
    </span>

    <span id="span_nine">
        <Passief />
    </span>
</section>

<style>
    #chart {
        min-width: 500px;
    }

    .tooltip {
        opacity: 0;
        position: absolute;
        display: flex;
        gap: 20px;
        padding: 10px;
        background-color: #fff;
        border: 1px solid #ddd;
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
        right: -23.4rem;
    }
    /* articles 10 and beyond */
    article:nth-of-type(n + 10) {
        left: -16.1rem;
    }

    #article_one {
        top: -0.5rem;
    }

    #article_two {
        top: 8.5rem;
    }

    #article_three {
        top: 18.4rem;
    }

    #article_four {
        top: 36.3rem;
    }

    #article_five {
        top: 46.4rem;
    }

    #article_six {
        top: 55.4rem;
    }

    #article_seven {
        top: 70rem;
    }

    #article_eight {
        top: 79.7rem;
    }

    #article_nine {
        top: 89.2rem;
    }

    #article_ten {
        top: 34.9rem;
    }

    #article_eleven {
        top: 62rem;
    }

    #span_one {
        top: 4.9rem;
        left: -6.3rem;
    }

    #span_two {
        top: 9.4rem;
        left: -12.4rem;
    }

    #span_three {
        top: 15rem;
        left: -6.6rem;
    }

    #span_four {
        top: 19.6rem;
        left: -7.75rem;
    }

    #span_five {
        top: 30.4rem;
        left: -7.3rem;
    }

    #span_six {
        top: 46.1rem;
        left: -8.5rem;
    }

    #span_seven {
        top: 55rem;
        left: -5.8rem;
    }

    #span_eight {
        top: 82.2rem;
        left: -7.8rem;
    }

    #span_nine {
        top: 86.1rem;
        left: -7.9rem;
    }
</style>

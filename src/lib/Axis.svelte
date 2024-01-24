<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    onMount(async () => {
        try {
            createChart();
        } catch (err) {
            console.error('Error loading JSON file:', err);
        }
    });

    const createChart = () => {
        const margin = { top: 20, right: 30, bottom: 30, left: 30 };
        const width = 500 - margin.left - margin.right;
        const height = 22 - margin.top - margin.bottom;

        const svg = d3
            .select('#axis')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // x axes
        const xScaleRight = d3
            .scaleLinear()
            .domain([0, 100])
            .range([0, width / 2]);

        const xScaleLeft = d3
            .scaleLinear()
            .domain([100, 0])
            .range([0, width / 2]);

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
    };
</script>

<div id="axis" />

<style>
    #axis {
        min-height: 35.55px;
        padding: 0.4rem 0 0.26rem 0;
    }
</style>
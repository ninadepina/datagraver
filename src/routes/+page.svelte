<script>
    import Chart from '$lib/Chart.svelte';
    import RightStacked from '$lib/RightStacked.svelte';
    import LeftStacked from '$lib/LeftStacked.svelte';
</script>

<h1>Tweede kamer door de jaren heen</h1>
<h2>
    In hoeverre hebben historische gebeurtenissen in Nederland invloed gehad op
    het stemgedrag van de bevolking tijdens de Tweede Kamer verkiezingen door de
    jaren heen?
</h2>
<div class="banner">
    <h3>Indeling politieke partijen - links/rechts</h3>
</div>

<div class="chart-container">
    <div class="chart chart_right">
        <RightStacked />
    </div>
    <div class="chart chart_left">
        <LeftStacked />
    </div>
    <div class="chart chart_main">
        <Chart />
    </div>
</div>

<style>
    .banner {
        width: 100%;
        margin: 1rem 0;
        background-color: var(--bg-color);
    }

    .chart-container {
        position: relative;
    }

    .chart {
        position: absolute;
    }

    .chart_main {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    }
</style>

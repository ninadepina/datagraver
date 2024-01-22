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
    .chart-container {
        position: relative;
        /* display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        margin-top: 2rem; */
    }

    .chart_main {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;

    }

    .chart {
        position: absolute;
    }
</style>

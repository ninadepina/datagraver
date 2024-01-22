<script>
    import Barchart from '$lib/Barchart.svelte';
    import Chart from '$lib/Chart.svelte';
    import Other from '$lib/Other.svelte';
</script>

<h1>Tweede kamer door de jaren heen</h1>
<h2>
    In hoeverre hebben historische gebeurtenissen in Nederland invloed gehad op
    het stemgedrag van de bevolking tijdens de Tweede Kamer verkiezingen door de
    jaren heen?
</h2>

<div class="chart-container">
    <!-- <Barchart /> -->
    <Chart />
    <!-- <Other /> -->
</div>

<style>
    .chart-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        margin-top: 2rem;
    }
</style>
<script>
    import { onMount } from 'svelte';

    import Chart from '$lib/Chart.svelte';
    import RightStacked from '$lib/RightStacked.svelte';
    import LeftStacked from '$lib/LeftStacked.svelte';

    import Barchart from '$lib/Barchart.svelte';

    import Tabs from '$lib/Tabs.svelte';

    let activePage = 'links-rechts';

    onMount(() => {
        document.querySelector('input[name="rtoggle"]').checked = true;
    });
</script>

<h1>Tweede kamer door de jaren heen</h1>
<h2>
    In hoeverre hebben historische gebeurtenissen in Nederland invloed gehad op
    het stemgedrag van de bevolking tijdens de Tweede Kamer verkiezingen door de
    jaren heen?
</h2>
<div class="banner">
    <h3>
        Indeling Tweede Kamer -
        <span>
            {#if activePage === 'man/vrouw'}
                man/vrouw
            {:else}
                links/rechts
            {/if}
        </span>
    </h3>
</div>

<div class="chart-container">
    {#if activePage === 'man/vrouw'}
        <div class="chart chart_2nd">
            <Barchart />
        </div>
    {:else}
        <div class="chart_1st">
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
    {/if}

    <div class="tabs">
        <Tabs bind:activePage />
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

    .chart_main,
    .chart_2nd {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    }

    .chart_2nd {
        margin-left: -0.6rem;
    }

    .tabs {
        position: fixed;
        top: 50%;
        left: -5.6rem;
        transform: translateY(-50%) rotate(-90deg) ;
    }
</style>

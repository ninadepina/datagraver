<script>
    import { onMount } from 'svelte';

    import Chart from '$lib/Chart.svelte';
    import RightStacked from '$lib/RightStacked.svelte';
    import LeftStacked from '$lib/LeftStacked.svelte';
    import Barchart from '$lib/Barchart.svelte';

    import Tabs from '$lib/Tabs.svelte';
    import Axis from '$lib/Axis.svelte';

    let activePage = 'links-rechts';
    let text;

    const handleScroll = () => {
        const scrollY = window.scrollY || window.pageYOffset;
        let opacity;

        switch (true) {
            case scrollY >= 150 && scrollY <= 185:
                opacity = 1 - (scrollY - 150) / 50;
                break;
            case scrollY > 185:
                opacity = 0;
                break;
            default:
                opacity = 1;
        }

        if (!text.style) return;
        text.style.opacity = opacity.toString();
    };

    onMount(() => {
        document.querySelector('input[name="rtoggle"]').checked = true;
        handleScroll();

        window.addEventListener('scroll', handleScroll);
    });
</script>

<h1>Tweede kamer door de jaren heen</h1>
<h2>
    In hoeverre hebben historische gebeurtenissen in Nederland invloed gehad op
    het stem-
    <span>
        gedrag van de bevolking tijdens de Tweede Kamer verkiezingen door de
        jaren heen?
    </span>
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

<div class="x">
    <div>
        <Axis />
    </div>
</div>

<div class="x-title" bind:this={text}>
    {#if activePage === 'man/vrouw'}
        <p>mannen</p>
        <p>vrouwen</p>
    {:else}
        <p>linkse partijen</p>
        <p>rechtse partijen</p>
    {/if}
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
    h2 span {
        word-spacing: 0.2rem;
    }

    .banner {
        position: sticky;
        top: 0;
        width: 100%;
        margin: 0 0 2rem 0;
        padding: 0.1rem 0 0.2rem 0;
        background-color: var(--bg-color);
        z-index: 999;
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

    .x {
        position: sticky;
        top: 1.66rem;
        margin-top: -1rem;
        margin-bottom: -1.83rem;
        display: flex;
        justify-content: center;
        z-index: 999;
    }
    .x > div {
        background-color: #fff;
        border-radius: 0 0 var(--border-radius) var(--border-radius);
    }

    .x-title {
        position: absolute;
        top: 14.8rem;
        left: 50%;
        display: flex;
        justify-content: space-between;
        width: 27.4rem;
        font-size: 0.5rem;
        font-style: italic;
        white-space: nowrap;
        transform: translateX(-50%);
        z-index: 999;
    }

    .tabs {
        position: fixed;
        top: 50%;
        left: -5.5rem;
        transform: translateY(-50%) rotate(-90deg);
        z-index: 999;
    }
</style>

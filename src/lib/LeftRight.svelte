<script>
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
</script>

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

<style>
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

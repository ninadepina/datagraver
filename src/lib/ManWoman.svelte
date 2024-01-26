<script>
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
    import Streefcijfer from '$lib/comp_periods/Streefcijfer.svelte';
    import Kieswet from '$lib/comp_periods/Kieswet.svelte';
    import WW2_2 from '$lib/comp_periods/WW2_4.svelte';
    import MeToo from '$lib/comp_moments/MeToo.svelte';
    import Abortus from '$lib/comp_moments/Abortus2.svelte';
    import Emancipatie from '$lib/comp_moments/Emancipatie.svelte';
    import Plicht from '$lib/comp_moments/Plicht.svelte';
    import UVRM from '$lib/comp_moments/UVRM.svelte';
    import Drucker from '$lib/comp_moments/Drucker.svelte';
    import Plicht2 from '$lib/comp_moments/Plicht2.svelte';
</script>

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

<style>
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
        top: 33.1rem;
        left: 3.15rem;
    }

    #span_three {
        top: 38.3rem;
        left: 0rem;
    }

    #span_four {
        top: 46.5rem;
        left: -1.65rem;
    }

    #span_five {
        top: 56.3rem;
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

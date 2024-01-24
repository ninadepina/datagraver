<script>
    import '../app.css';
    import Footer from '$lib/footer.svelte';
</script>

<main>
    <slot />
</main>

<Footer />

<style>
    main {
        min-height: 1800px;
    }
</style>
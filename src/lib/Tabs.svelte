<script>
    export let activePage = 'links/rechts';

    let pages = [
        { id: 'links-rechts', value: 'links/rechts' },
        { id: 'man-vrouw', value: 'man/vrouw' }
    ];
</script>

<div id="menu" class="switch">
    {#each pages as { id, value }}
        <input
            type="radio"
            {id}
            name="rtoggle"
            bind:group={activePage}
            {value}
        />
        <label for={id}>{value}</label>
    {/each}
</div>

<style>
    .switch {
        position: relative;
        display: flex;
        gap: 1px;
        padding-right: 1px;
        overflow: hidden;
        cursor: pointer;
        z-index: 1;
    }

    .switch input {
        position: absolute !important;
        clip: rect(0, 0, 0, 0);
        width: 1px;
        height: 1px;
        border: 0;
        overflow: hidden;
    }

    .switch label {
        --border-radius: 0.5rem;

        margin-right: -1px;
        padding: 1rem 1rem 0.5rem 1rem;
        font-size: 14px;
        line-height: 1;
        text-align: center;
        background-color: #fff;
        cursor: pointer;
    }
    .switch label:first-of-type {
        border-radius: 0 0 var(--border-radius) var(--border-radius);
    }
    .switch label:last-of-type {
        border-radius: 0 0 var(--border-radius) var(--border-radius);
    }
    .switch label:hover {
        text-decoration: underline;
    }

    .switch input:checked + label {
        color: #fff;
        background-color: var(--color);
        box-shadow: none;
    }
</style>

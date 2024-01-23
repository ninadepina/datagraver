<section>
    <div>
        <div class="title">
            <strong>1953</strong>
        </div>
        <div class="text">
            <p>
                In het jaar van de Watersnoodramp (1953) waren er geen Tweede Kamerverkiezingen.
            </p>
        </div>
    </div>
    <img src="watersnoodramp.png" alt="" />
</section>

<style>
    section {
        display: flex;
        align-items: flex-end;
        gap: 0.8rem;
        height: 106px;
        padding: 0 0.75rem 0.75rem 0.75rem;
        background-color: var(--bg-color);
    }
    section::before {
        content: '';
        position: absolute;
        top: 3.8rem;
        left: -4.9rem;
        width: 5rem;
        height: 7rem;
        background-color: var(--bg-color);
        clip-path: polygon(0 100%, 100% 30%, 100% 0)
    }

    .title {
        margin: 0;
        padding: 0;
    }

    .text p {
        width: 190px;
    }

    img {
        position: relative;
        right: -0.75rem;
        bottom: -0.75rem;
        width: 166px;
    }
</style>
<section>
    <div>
        <div class="title">
            <strong>2002</strong>
        </div>
        <div class="text">
            <p>
                In mei 2002 werd na de moord op Pim Fortuyn overwogen de
                verkiezingen uit te stellen, maar na overleg met de familie
                Fortuyn en de leiding van de LPF werd besloten dat de
                verkiezingen doorgingen.
            </p>
        </div>
    </div>
    <img src="fortuyn.png" alt="" />
</section>

<style>
    section {
        display: flex;
        align-items: flex-end;
        gap: 0.9rem;
        padding: 0.25rem 0.75rem 0.75rem 0.75rem;
        background-color: var(--bg-color);
    }
    section::before {
        content: '';
        position: absolute;
        top: 0.8rem;
        left: -4.9rem;
        width: 5rem;
        height: 5rem;
        background-color: var(--bg-color);
        clip-path: polygon(0 0, 100% 50%, 100% 80%)
    }

    .title {
        margin: 0;
        padding: 0;
    }

    .text p {
        width: 210px;
    }

    img {
        position: relative;
        right: -0.75rem;
        bottom: -0.75rem;
        width: 150px;
    }
</style>
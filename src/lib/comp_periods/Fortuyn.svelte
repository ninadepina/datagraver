<section>
    <div>
        <div>
            <div class="title">
                <strong>2002</strong>
            </div>
            <div class="text">
                <p>
                    Na de moord op Pim Fortuyn in mei 2002 werd overwogen de
                    verkiezingen uit te stellen. Na overleg met de familie
                    Fortuyn en de LPF werd echter besloten dat de verkiezingen
                    toch zouden plaatsvinden.
                </p>
            </div>
        </div>
        <img src="fortuyn.png" alt="" />
    </div>
    <div>
        <p>
            Pim Fortuyn betrad op stormachtige wijze de politiek en bedreef
            politiek op onconventionele wijze. Bekend om zijn flamboyante en
            controversiële stijl. Hij was fel tegenstander van het 'paarse
            kabinet' en het 'poldermodel'.
        </p>
    </div>
</section>

<style>
    section {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    section::before {
        content: '';
        position: absolute;
        top: 0.8rem;
        left: -4.9rem;
        width: 5rem;
        height: 5rem;
        background-color: var(--bg-color);
        clip-path: polygon(0 0, 100% 50%, 100% 80%);
    }

    section > div:first-of-type {
        display: flex;
        align-items: flex-end;
        gap: 0.9rem;
        padding: 0.25rem 0.75rem 0.75rem 0.75rem;
        background-color: var(--bg-color);
    }
    section > div:last-of-type {
        width: 398.39px;
        padding: 0.75rem;
        font-size: 0.85rem;
        background-color: var(--bg-color);
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

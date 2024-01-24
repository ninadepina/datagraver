<section>
    <img src="verdrag.png" alt="" />
    <div class="title">
        <strong>1980</strong>
        <p>Ratificatie VN-Vrouwenverdrag</p>
    </div>
    <div class="text">
        <p>
            Een mensenrechtenverdrag dat de lidstaten van de Verenigde Naties
            (VN) verplicht om alle vormen van discriminatie van vrouwen uit te
            bannen. 
        </p>
        <p>
            Opgesteld in 1979 en door Nederland geratificeerd
            (bekrachtigd) in 1980.
        </p>
    </div>
</section>

<style>
    section {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        width: 508px;
        border-bottom: 2px solid var(--color);
    }

    img {
        position: absolute;
        width: 299px;
        border-radius: 8px 0 0 0;
    }

    .title {
        z-index: 2;
    }

    strong,
    .title p {
        width: fit-content;
        padding: 0 0.3rem;
        background-color: white;
    }
    strong {
        position: relative;
        bottom: -0.6rem;
        left: -0.3rem;
        padding-top: 0.1rem;
        z-index: 3;
    }
    .title p {
        position: relative;
        bottom: -0.3rem;
        left: -0.3rem;
        padding-top: 0.3rem;
        padding-bottom: 0.3rem;
    }

    .text {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 0.75rem;
        background-color: var(--bg-color);
    }
    .text p {
        max-width: 186px;
    }
</style>

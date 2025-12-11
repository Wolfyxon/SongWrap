<script lang="ts">
    import type { ArtistData } from "$lib/stats";
    import defaultIcon from "$lib/assets/artist.svg";

    export let data: ArtistData;
</script>

<style>
    .artist {
        display: flex;
        min-width: 200px;
        flex-direction: column;
        background: var(--panel);
        text-align: center;
    }

    .artist-text {
        display: flex;
        flex-direction: column;
        padding: 10px 20px;
        padding-top: 0;
    }

    .artist img {
        object-fit: contain;
        width: 100%;
        height: 20vh;
        background: var(--panel-dark);
    }

    .artist-name {
        font-size: 200%;
        font-weight: bold;
    }
</style>

<div class="artist">
    <img src={defaultIcon} alt="Artist logo" />

    <div class="artist-text">
        <div class="artist-name">
            {data.name}
        </div>

        <div>
            Song plays: {data.totalPlays}
        </div>
    </div>
</div>

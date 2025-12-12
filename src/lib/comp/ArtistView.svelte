<script lang="ts">
    import type { ArtistData } from "$lib/stats";
    import defaultIcon from "$lib/assets/artist.svg";

    export let data: ArtistData;
    export let animIndex: number | null = null;
</script>

<style>
    .artist {
        display: flex;
        flex-direction: column;
        text-align: center;
        max-width: 40vw;
        gap: 5px;
    }

    .artist.animated {
        animation: slide-in-bottom 1s var(--anim-delay) forwards;
        opacity: 0;
    }

    .artist-text {
        display: flex;
        flex-direction: column;
        padding-top: 0;
        gap: 5px;
    }

    .artist img {
        object-fit: contain;
        margin: 0 auto;
        width: 150px;
        height: 150px;
        background: var(--panel-dark);
        border-radius: 100%;
    }

    .artist-name {
        font-size: 150%;
        font-weight: bold;
    }
</style>

<div 
    class="artist"
    class:animated={animIndex != null}
    style={animIndex != null ? `--anim-delay: ${(animIndex) * 0.25}s` : undefined} 
>
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

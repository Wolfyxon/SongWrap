<script lang="ts">
    import defaultIcon from "$lib/assets/note.svg";
    import type { SongData } from "$lib/stats";

    export let data: SongData;
</script>

<style>
    .song {
        display: flex;
        background: var(--panel);
        width: 100%;
        margin-bottom: 5px;
        align-items: stretch;
    }

    .song-icon {
        min-width: 100px;
        object-fit: contain;
        background: var(--panel-dark);
    }

    .song-text {
        flex: 1;
        padding: 20px;
    }

    .song-title {
        font-weight: bold;
        font-size: 120%;
    }

    .song-plays {
        opacity: 0.8;
    }
</style>

<div class="song">
    <img alt="Cover art" class="song-icon" src={defaultIcon} />
    <div class="song-text">
        <div class="song-title">{data.title}</div>
        <div class="song-artist">{data.artist}</div>
        <div class="song-plays">Played {data.totalPlays} times</div>
    </div>
</div>
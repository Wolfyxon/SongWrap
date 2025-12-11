<script lang="ts">
    import type { SongAPI } from "$lib/api/api";
    import defaultIcon from "$lib/assets/note.svg";
    import type { SongData } from "$lib/stats";
    
    let icon = defaultIcon;

    export let data: SongData;
    export let api: SongAPI | null = null;
    export let animIndex: number | null = null;

    async function load() {
        if(api) {
            const artist = await api.queryArtistByName(data.artist);
            const song = await api.querySongByName(data.title, artist?.id)

            if(song && song.coverArt) {
                icon = song.coverArt;
            }
        }
    }

    load();
</script>

<style>
    .song {
        display: flex;
        background: var(--panel);
        width: 100%;
        margin-bottom: 5px;
        align-items: stretch;
    }

    .song.animated {
        animation: slide-in-bottom var(--anim-duration);
    }

    .song-icon {
        width: 100px;
        height: 100%;
        object-fit: cover;
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

<div 
    class="song"
    class:animated={animIndex != null}
    style={animIndex != null ? `--anim-duration: ${(animIndex + 1) * 0.5}s` : undefined} 
>
    <img 
        alt="Cover art" 
        class="song-icon"
        src={icon} 
    />
    <div class="song-text">
        <div class="song-title">{data.title}</div>
        <div class="song-artist">{data.artist}</div>
        <div class="song-plays">Played {data.totalPlays} times</div>
    </div>
</div>
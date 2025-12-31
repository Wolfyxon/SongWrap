<script lang="ts">
    import type { SongAPI } from "$lib/api/api";
    import defaultIcon from "$lib/assets/note.svg";
    import type { SongData } from "$lib/stats";
    
    let icon = defaultIcon;

    export let data: SongData;
    export let api: SongAPI | null = null;
    export let animIndex: number | null = null;
    export let displayMode: "square" | "entry" = "square";
    export let showPlays: boolean = false;

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

{#if displayMode == "entry"}
    <style>
        .song {
            display: flex;
            background: var(--panel);
            width: 100%;
            margin-bottom: 5px;
            height: 100px;
        }

        .song-icon {
            width: 100px;
        }

        .song-text {
            flex: 1;
            padding: 20px;
        }
    </style>
{:else}
    <style>
        .song {
            display: flex;
            flex-direction: column;
            width: fit-content;
            text-align: center;
        }


        .song-icon {
            width: 170px;
        }
    </style>
{/if}

<style>
    .song.animated {
        animation: slide-in-bottom var(--anim-duration);
    }

    .song-icon {
            height: 100%;
            object-fit: cover;
            background: var(--panel-dark);
    }

    .song-title {
        font-weight: bold;
        font-size: 120%;
    }

    .song-plays {
        opacity: 0.8;
        font-size: 95%;
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
        
        {#if showPlays}
            <div class="song-plays">Played {data.totalPlays} times</div>
        {/if}
    </div>
</div>
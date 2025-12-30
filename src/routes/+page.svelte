<script lang="ts">
    import type { StatsProcessor, StatsData, StatsViewConfig, ProcessedStats } from "$lib/stats";
    
    import Home from "$lib/layout/Home.svelte";
    import Page from "$lib/comp/Page.svelte";
    import StatsView from "$lib/layout/StatsView.svelte";
    import { SongAPI } from "$lib/api/api";
    import ProgressBar from "$lib/comp/ProgressBar.svelte";
    import { wait } from "$lib/util";
    import { preloadImage } from "$lib/util/dom";
    import LinkButton from "$lib/LinkButton.svelte";
    
    const api = new SongAPI();

    let currentStats: ProcessedStats | null = null;
    let statsProcessed = false;
    let progress = 0;
    let progressMax = 0;

    async function setStats(stats: ProcessedStats | null) {
        statsProcessed = false;
        progress = 0;
        currentStats = stats;
        
        if(stats) {
            api.setOffline(false);

            const songs = stats.data.topSongs;
            const artists = stats.data.topArtists;
            
            progressMax = songs.length * 3 + artists.length;

            for(let i = 0; i < songs.length; i++) {
                const songStat = songs[i];

                const artist = await api.queryArtistByName(songStat.artist);
                progress++;

                const song = await api.querySongByName(songStat.title, artist?.id);
                progress++;

                if(song?.coverArt && !api.isOffline()) {
                    await preloadImage(song.coverArt, 2000);
                }

                progress++;

                // Account for rate limit
                if(i % 20 == 0) {
                    await wait(1000);
                }
            }

            for(let i = 0; i <artists.length; i++) {
                await api.queryArtistByName(artists[i].name);
                progress++;

                // Account for rate limit
                if(i % 20 == 0) {
                    await wait(1000);
                }
            }

            statsProcessed = true;
        }
    }

    function reset() {
        setStats(null);

        const urlSplit = window.location.href.split("?");
        const urlWithoutParams = urlSplit[0];
        window.history.pushState({}, document.title, urlWithoutParams);
    }
</script>

<style>
    #loading {
        animation: fade-in 2s, scale-in 0.3s;
        display: flex;
        flex-direction: column;
        justify-content: center;
        max-width: 800px;
        margin: 0 auto;
        padding: 5px;
        height: 100%;
        text-align: center;
    }

    #loading h1 {
        animation: flash 2s infinite; 
        text-align: center
    }

    #loading p {
        opacity: 0.5;
    }

    #loading-offline-hint {
        opacity: 0;
        animation: fade-in 5s forwards;
        animation-delay: 6s;
    }
</style>

<Page>
    {#if currentStats && statsProcessed}
        <StatsView 
            stats={currentStats}
            api={api}
            onClose={reset} 
        />
    {:else if currentStats && !statsProcessed}
        <div id="loading">
            <h1>Loading songs...</h1>
            <ProgressBar value={progress} max={progressMax} />
            <p>Getting cover arts...</p>

            <div id="loading-offline-hint">
                Taking too long?
                <LinkButton text="Skip loading" onClick={() => api.setOffline(true)} />
            </div>
        </div>
    {:else}
        <Home setStats={setStats}/>
    {/if}
</Page>

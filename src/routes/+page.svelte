<script lang="ts">
    import { type StatsProcessor, type StatsData, type StatsViewConfig, ProcessedStats } from "$lib/stats";
    
    import Home from "$lib/layout/Home.svelte";
    import Page from "$lib/comp/Page.svelte";
    import StatsView from "$lib/layout/StatsView.svelte";
    import { SongAPI, type APIArtist } from "$lib/api/api";
    import ProgressBar from "$lib/comp/ProgressBar.svelte";
    import { wait } from "$lib/util";
    import { preloadImage } from "$lib/util/dom";
    import LinkButton from "$lib/LinkButton.svelte";
    import { removeUrlParams } from "$lib/util/string";
    
    const api = new SongAPI();
    let offlineFlag = false;

    let currentStats: ProcessedStats | null = null;
    let statsProcessed = false;
    let progress = 0;
    let progressMax = 0;
    let shareName: string | null = null;

    async function setStats(stats: ProcessedStats | null) {
        statsProcessed = false;
        progress = 0;
        currentStats = stats;
        
        if(stats) {
            api.setOffline(offlineFlag);

            const songs = stats.data.songs;
            const artists = stats.data.artists;
            
            progressMax = songs.length * 3 + artists.length;
            
            for(let i = 0; i < songs.length; i++) {
                const songStat = songs[i];
                const artistData = artists[songStat.artist]

                let artist: APIArtist | undefined;

                if(artistData) {
                    artist = await api.queryArtistByName(artistData.name);
                } else {
                    console.warn(`Artist at index ${songStat.artist} not found. Song '${songStat.title}'`);
                }

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
        window.history.pushState({}, document.title, removeUrlParams(window.location.href));
    }

    if(!import.meta.env.SSR) {
        const params = new URLSearchParams(window.location.search);
        const base64 = params.get("s");
        const offline = params.get("offline");
        const paramShareName = params.get("name");

        if(offline) {
            offlineFlag = true;
        }

        if(base64) {
            if(paramShareName) {
                shareName = paramShareName;
            } else {
                shareName = "Someone";
            }

            setTimeout(() => {
                setStats(ProcessedStats.fromBase64(base64));
            });
        }
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
            receivedShareName={shareName}
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

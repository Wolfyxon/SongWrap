<script lang="ts">
    import type { Stats, StatsData, StatsViewConfig } from "$lib/stats";
    
    import Home from "$lib/layout/Home.svelte";
    import Page from "$lib/comp/Page.svelte";
    import StatsView from "$lib/layout/StatsView.svelte";
    import { SongAPI } from "$lib/api/api";
    import ProgressBar from "$lib/comp/ProgressBar.svelte";
    
    const api = new SongAPI();

    let currentStats: Stats | null = null;
    let statsProcessed = false;
    let progress = 0;
    let progressMax = 0;

    const config: StatsViewConfig = {
        songRankCount: 4,
        artistRankCount: 3
    };

    async function setStats(stats: Stats | null) {
        currentStats = stats;
        statsProcessed = false;
        progress = 0;

        if(stats) {
            const songs = stats.data.songs.slice(0, config.songRankCount);
            progressMax = songs.length * 2;

            for(const song of songs) {
                const artist = await api.queryArtistByName(song.artist);
                progress++;

                await api.querySongByName(song.title, artist?.id);
                progress++;
            }

            statsProcessed = true;
        }
    }
</script>

<style>
    #loading {
        animation: fade-in 1s;
        display: flex;
        flex-direction: column;
        justify-content: center;
        max-width: 800px;
        margin: 0 auto;
        padding: 5px;
        height: 100%;
    }
</style>

<Page>
    {#if currentStats && statsProcessed}
        <StatsView 
            stats={currentStats}
            api={api}
            config={config}
            onClose={() => setStats(null)} 
        />
    {:else if currentStats && !statsProcessed || true}
        <div id="loading">
            <h1 style="animation: flash 2s infinite; text-align: center">Getting song info...</h1>
            <ProgressBar value={progress} max={progressMax} />
        </div>
    {:else}
        <Home setStats={setStats}/>
    {/if}
</Page>

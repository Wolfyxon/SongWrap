<script lang="ts">
    import type { Stats, StatsData, StatsViewConfig } from "$lib/stats";
    
    import Home from "$lib/layout/Home.svelte";
    import Page from "$lib/comp/Page.svelte";
    import StatsView from "$lib/layout/StatsView.svelte";
    import { SongAPI } from "$lib/api/api";
    
    const api = new SongAPI();

    let currentStats: Stats | null = null;
    let statsProcessed = false;

    const config: StatsViewConfig = {
        songRankCount: 4,
        artistRankCount: 3
    };

    async function setStats(stats: Stats | null) {
        currentStats = stats;
        statsProcessed = false;

        if(stats) {
            // Load API data to cache

            for(const song of stats.data.songs.slice(config.songRankCount)) {
                const artist = await api.queryArtistByName(song.artist);
                await api.querySongByName(song.title, artist?.id);
            }

            statsProcessed = true;
        }
    }
</script>

<Page>
    {#if currentStats && statsProcessed}
        <StatsView 
            stats={currentStats}
            api={api}
            config={config}
            onClose={() => setStats(null)} 
        />
    {:else if currentStats && !statsProcessed}
        <h1 style="animation: flash 2s infinite; text-align: center">Getting song info...</h1>
    {:else}
        <Home setStats={setStats}/>
    {/if}
</Page>

<script lang="ts">
    import type { Stats, StatsData } from "$lib/stats";
    
    import Home from "$lib/layout/Home.svelte";
    import Page from "$lib/comp/Page.svelte";
    import StatsView from "$lib/layout/StatsView.svelte";
    
    let currentStats: Stats | null = null;

    function setStats(stats: Stats) {
        currentStats = stats;
    }
</script>

<Page>
    {#if currentStats}
        <StatsView stats={currentStats} />
    {:else}
        <Home setStats={setStats}/>
    {/if}
</Page>

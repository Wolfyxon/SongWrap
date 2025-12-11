<script lang="ts">
    import PageContainer from "$lib/comp/PageContainer.svelte";
    import SongList from "$lib/comp/SongList.svelte";
    import SongView from "$lib/comp/SongView.svelte";
    import type { Stats } from "$lib/stats";

    export let stats: Stats;
</script>

<style>
    #stats-view-main {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
    }

    #stats-view-content {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        flex: 1;
    }
</style>

<div id="stats-view-main">
    <div id="stats-view-content">
        <PageContainer page={0}>
            <div>
                <h1>Your favorite songs</h1>
                <SongList songs={stats.data.songs.slice(0, 4)} />
            </div>
        </PageContainer>
        
    </div>
    <div id="stats-controls">
        <button>Previous</button>
        <button>Next</button>
    </div>
</div>
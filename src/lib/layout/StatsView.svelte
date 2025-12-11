<script lang="ts">
    import PageContainer from "$lib/comp/PageContainer.svelte";
    import SongList from "$lib/comp/SongList.svelte";
    import SongView from "$lib/comp/SongView.svelte";
    import type { Stats } from "$lib/stats";

    export let stats: Stats;

    let currentPage = 0;
    const pageCount = 2;

    function prev() {
        if(currentPage > 0) {
            currentPage -= 1;
        }
    }

    function next() {
        if(currentPage < pageCount) {
            currentPage += 1;
        }
    }
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
        {#snippet pageIntro()}
            <h1>Let's see</h1>
        {/snippet}

        {#snippet pageFavSongsAllTime()}
            <h1>Your favorite songs</h1>
            <p>Of all time</p>
            <SongList songs={stats.data.songs.slice(0, 4)} />
        {/snippet}

        <PageContainer page={currentPage} pages={[pageIntro, pageFavSongsAllTime]}>
        </PageContainer>
        
    </div>
    <div id="stats-controls">
        <button onclick={prev}>Previous</button>
        <button onclick={next}>Next</button>
    </div>
</div>
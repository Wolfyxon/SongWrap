<script lang="ts">
    import ArtistList from "$lib/comp/ArtistList.svelte";
    import PageContainer from "$lib/comp/PageContainer.svelte";
    import SongList from "$lib/comp/SongList.svelte";
    import SongView from "$lib/comp/SongView.svelte";
    import type { Stats } from "$lib/stats";

    export let stats: Stats;

    let currentPage = 0;
    const pageCount = 3;

    function prev() {
        if(currentPage > 0) {
            currentPage -= 1;
        }
    }

    function next() {
        if(currentPage < pageCount - 1) {
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

    #stats-view-content h1 {
        text-align: center;
    }
</style>

<div id="stats-view-main">
    <div id="stats-view-content">
        {#snippet pageIntro()}
            <h1>Let's see</h1>
        {/snippet}

        {#snippet pageFavSongsAllTime()}
            <h1>Your favorite songs of all time</h1>
            <SongList songs={stats.data.songs.slice(0, 4)} />
        {/snippet}

        {#snippet pageFavArtistsAllTime()}
            <h1>Your favorite artists of all time</h1>
            <ArtistList artists={stats.getArtists(true).slice(0, 3)} />
        {/snippet}
        
        <PageContainer page={currentPage} pages={[pageIntro, pageFavSongsAllTime, pageFavArtistsAllTime]}>
        </PageContainer>
        
    </div>
    <div id="stats-controls">
        <button onclick={prev}>Previous</button>
        <button onclick={next}>Next</button>
    </div>
</div>
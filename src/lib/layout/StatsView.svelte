<script lang="ts">
    import { SongAPI } from "$lib/api/api";
    import ArtistList from "$lib/comp/ArtistList.svelte";
    import CopyField from "$lib/comp/CopyField.svelte";
    import Counter from "$lib/comp/Counter.svelte";
    import PageContainer from "$lib/comp/PageContainer.svelte";
    import SongList from "$lib/comp/SongList.svelte";
    import LinkButton from "$lib/LinkButton.svelte";
    import type { ProcessedStats } from "$lib/stats";
    import { STATS_INTROS, STATS_OUTROS } from "$lib/strings";
    import { randChoice } from "$lib/util/array";

    export let stats: ProcessedStats;
    export let api: SongAPI;

    export let onClose: () => any = () => console.warn("onClose not set")

    const introText = randChoice(STATS_INTROS);
    const outroText = randChoice(STATS_OUTROS);

    let currentPage = 0;
    const pageCount = 5;

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

    #stats-controls {
        display: flex;
        gap: 10px;
        z-index: 5;
    }
</style>

<div id="stats-view-main">
    <div id="stats-view-content">
        {#snippet pageIntro()}
            <h1>{introText}</h1>
        {/snippet}

        {#snippet numStats()}
            <h1>You listened to</h1>

            <div class="flex">
                <Counter
                    value={stats.data.artistCount}
                    label="Artists"
                />
                
                <Counter 
                    value={stats.data.songCount}
                    label="Songs"
                />
            </div>
        {/snippet}

        {#snippet pageFavSongsAllTime()}
            <h1>These are your favorite songs</h1>
            <SongList songs={stats.getTopSongs()} api={api} />
        {/snippet}

        {#snippet pageFavArtistsAllTime()}
            <h1>And these are your favorite artists</h1>
            <ArtistList artists={stats.getTopArtists()} />
        {/snippet}

        {#snippet pageEnd()}
            <h1>{outroText}</h1>
            
            <div style="text-align: center; margin: 0 auto; max-width: 500px">
                <p>Share your stats!</p>
                <CopyField value={window.location.href + "?s=" + stats.toBase64()} />
                <LinkButton text="Home page" onClick={onClose} highlight />
            </div>
        {/snippet}
        
        <PageContainer 
            page={currentPage} 
            pages={
                [
                    pageIntro,
                    numStats, 
                    pageFavSongsAllTime, 
                    pageFavArtistsAllTime, 
                    pageEnd
                ]
            }
        >
        </PageContainer>
        
    </div>
    <div id="stats-controls">
        <button onclick={prev}>Previous</button>
        <button onclick={next}>Next</button>
    </div>
</div>
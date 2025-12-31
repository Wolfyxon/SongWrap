<script lang="ts">
    import { SongAPI } from "$lib/api/api";
    import ArtistList from "$lib/comp/ArtistList.svelte";
    import CopyField from "$lib/comp/CopyField.svelte";
    import Counter from "$lib/comp/Counter.svelte";
    import PageContainer from "$lib/comp/PageContainer.svelte";
    import SongList from "$lib/comp/SongList.svelte";
    import SongView from "$lib/comp/SongView.svelte";
    import LinkButton from "$lib/LinkButton.svelte";
    import type { ProcessedStats } from "$lib/stats";
    import { STATS_INTROS, STATS_OUTROS } from "$lib/strings";
    import { randChoice } from "$lib/util/array";
    import { capitalize, removeUrlParams } from "$lib/util/string";

    export let stats: ProcessedStats;
    export let api: SongAPI;
    export let receivedShareName: string | null = null;

    export let onClose: () => any = () => console.warn("onClose not set")

    const introText = randChoice(STATS_INTROS);
    const outroText = randChoice(STATS_OUTROS);
    const defaultName = "Someone";

    let shareName: string | undefined;
    let pronoun1 = "you";
    let pronoun2 = "your";
    
    let currentPage = 0;
    const pageCount = 6;

    if(receivedShareName) {
        pronoun1 = "they";
        pronoun2 = "their";
    }

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
            <h1>
                {#if receivedShareName}
                    {receivedShareName} wants to show you their music taste!
                {:else}
                    {introText}
                {/if}
            </h1>
        {/snippet}

        {#snippet obsession()}
            <h1>{capitalize(pronoun2)} were most obsessed about</h1>
            
            <style>
                #obsession-list > * {
                    animation: pulse 1s infinite;
                }
            </style>

            <div class="center-container" id="obsession-list">
                <SongView data={stats.getSongsByObsession()[0]} api={api} />
            </div>
        {/snippet}

        {#snippet numStats()}
            <h1>{capitalize(pronoun1)} listened to</h1>

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
            <h1>These are {pronoun2} favorite songs</h1>
            <SongList songs={stats.getTopSongs()} api={api} />
        {/snippet}

        {#snippet pageFavArtistsAllTime()}
            <h1>And these are {pronoun2} favorite artists</h1>
            <ArtistList artists={stats.getTopArtists()} />
        {/snippet}

        {#snippet pageEnd()}
            <h1>{outroText}</h1>

            <div class="center-container">
                {#if !receivedShareName}
                    <h2>Share your stats!</h2>
                    <label for="name-inp">Your name: (optional)</label>
                    
                    <input
                        type="text" 
                        maxlength="28" 
                        bind:value={shareName} 
                        placeholder={defaultName}
                        id="name-inp" 
                    />
                    
                    <CopyField value={
                        (() => {
                            let nameParam = "";
                            const statsParam = `s=${stats.toBase64()}`;

                            if(shareName && shareName.length != 0 && shareName != defaultName) {
                                nameParam = `name=${shareName}&`;
                            }

                            return `${removeUrlParams(window.location.href)}?${nameParam}${statsParam}`
                        })()
                    } />
                {/if}

                <LinkButton text="Home page" onClick={onClose} highlight />
            </div>
        {/snippet}
        
        <PageContainer 
            page={currentPage} 
            pages={
                [
                    pageIntro,
                    numStats,
                    obsession,
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
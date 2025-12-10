<script lang="ts">
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
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        flex: 1;
    }
</style>

<div id="stats-view-main">
    <div id="stats-view-content">
        <h1>Your favorite songs</h1>

        <!-- TOOD: make it fancy -->
        <ol style="flex: 0.5">
            {#each stats.data.songs.slice(0, 5) as song, index }
                <li>{song.title} - {song.artist}: {song.totalPlays} plays</li>
            {/each}
        </ol>
    </div>
    <div id="stats-controls">
        <button>Previous</button>
        <button>Next</button>
    </div>
</div>
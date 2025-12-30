<script lang="ts">
    import type { SongAPI } from "$lib/api/api";
    import type { SongData } from "$lib/stats";
    import SongViewEntry from "./SongEntryView.svelte";

    export let api: SongAPI | null = null;
    export let songs: SongData[];
</script>

<style>
    .song-list {
        flex: 0.5; 
        width: 100%; 
        max-width: 500px;
    }
</style>

<div class="song-list">
    {#each songs as song, index }
        <SongViewEntry data={song} animIndex={index} api={api} />
    {/each}
</div>

<script lang="ts">
    import type { SongData } from "$lib/stats";
    import SongView from "./SongView.svelte";

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
        <SongView data={song} animIndex={index} />
    {/each}
</div>

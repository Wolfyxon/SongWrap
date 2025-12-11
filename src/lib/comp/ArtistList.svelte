<script lang="ts">
    import type { ArtistData } from "$lib/stats";
    import ArtistView from "./ArtistView.svelte";

    export let artists: ArtistData[];
</script>

<style>
    .artist-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 20px;
    }
</style>

<div class="artist-list">
    {#each artists as artist}
        <ArtistView data={artist} />
    {/each}
</div>
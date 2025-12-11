<script lang="ts">
    import type { Snippet } from "svelte";

    export let pages: Snippet[];
    export let page: number;
</script>

<style>
    .page-container-content :global(*) {
        animation: fade-in 1s;
    }
</style>

<div class="page-container">
    <div class="page-container-content">
        {@render pages[page]()}
    </div>
</div>


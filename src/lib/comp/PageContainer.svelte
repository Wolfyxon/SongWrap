<script lang="ts">
    import type { Snippet } from "svelte";

    export let pages: Snippet[];
    export let page: number;
</script>

<div class="page-container">
    {@render pages[page]()}
</div>


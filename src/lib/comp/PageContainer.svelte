<script lang="ts">
    import type { Snippet } from "svelte";

    export let children: Snippet<[number]>;
    export let page: number;

</script>

<div class="page-container">
    {@render children(page)}
</div>


<!-- TODO: Page title and description -->

<script lang="ts">
    import Footer from "./Footer.svelte";

    let { children } = $props();
</script>

<main>
    {@render children()}

    <Footer />
</main>

<!-- TODO: Page title and description -->

<script lang="ts">
    import Footer from "./Footer.svelte";

    let { children } = $props();
</script>

<main>
    <div id="site-content">
        {@render children()}
    </div>

    <Footer />
</main>

<script>
    import FileUpload from "$lib/comp/FileUpload.svelte";
    import Footer from "$lib/comp/Footer.svelte";
    import Page from "$lib/comp/Page.svelte";

</script>

<style>
    #banner {
        text-align: center;
    }

    #banner h1 {
        font-size: 400%;
    }
</style>

<Page>
    <div id="banner">
        <h1>SongWrap</h1>
    </div>

    <FileUpload label="Upload a stat file" />

    <div>
        <h2>How to get your stats file?</h2>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque ipsum dolorum ipsa enim magni dolore? Iusto quaerat nesciunt dolores ullam obcaecati magnam veniam doloremque odit, cum nihil omnis, illo excepturi.
        </p>
    </div>
</Page>
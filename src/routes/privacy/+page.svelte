<script>
    import Page from "$lib/comp/Page.svelte";
</script>

<Page>
    <div>
        <h1>Privacy</h1>
        <a href=".">Go back to home</a>

        <h2>Data processing</h2>
        <p>
            When you upload a stats file, requests are made to the <a href="https://musicbrainz.org/">MusicBrainz</a> database to
            retrieve cover arts for each song. <br />
            The sent data includes only the song title and artist.
            This data is extracted in your browser and the file itself is not shared.
        </p>
        <p>
            SongWrap also allows you to share your stats via URL. 
            That URL does not point to any data on the website as it does not store your stats.
            Your processed stats data is encoded in the URL and contains only the necessary information required to display the stats, everything
            that's not needed is removed.
        </p>
        <p>
            <a href="https://metabrainz.org/privacy">MusicBrainz privacy policy</a>
        </p>
        <p>
            This website does not store any user data.
        </p>
    </div>
</Page>
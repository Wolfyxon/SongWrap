<script>
    import Page from "$lib/comp/Page.svelte";
</script>

<Page>
    <h1>About SongWrap</h1>
    <a href=".">Go back to home</a>

    <p>
        SongWrap is an open source site for viewing your song listening stats, inspired by Spotify Wrapped.
    </p>

    <p>
        <a href="https://github.com/wolfyxon/SongWrap">Source code</a>
        <a href="https://github.com/wolfyxon/SongWrap/issues">Bug reports & suggestions</a>
    </p>

    <h2>How does it work?</h2>

    <p>
        SongWrap works by analyzing a JSON file thats contains all the required data to make the stats.
        Then it sends queries the <a href="https://musicbrainz.org/">MusicBrainz</a> API to retrieve cover arts
        for each song.
    </p>

    <h2>How do I get a stats file?</h2>
    <p>
        Currently these projects are able to gather your stats:
    </p>
    <ul>
        <li>
            <a href="https://github.com/Wolfyxon/AudaciousStats">AudaciousStats</a>: a plugin for the Audacious media player
        </li>
    </ul>
    <p>
        If you'd like to create your own project or manually make a stats file, see the 
        <a href="https://github.com/wolfyxon/Songwrap/tree/main/README.md">format specification</a>.
    </p>

    <h2>Copyright</h2>
    <p>
        Most cover arts for each song are retrieved from <a href="https://musicbrainz.org/">MusicBrainz</a>.
        I am not their creator and they're not stored on the website.
    </p>
    <p>
        Some icons used here are made by Google
        (<a href="https://fonts.google.com/icons">Google Icons</a>) and are licensed under the
        <a href="https://www.apache.org/licenses/LICENSE-2.0.html">Apache License 2.0</a>.
    </p>
    <p>
        This website is licensed under the 
        <a href="https://github.com/wolfyxon/songwrap/tree/main/LICENSE">GNU General Public License</a>.
    </p>
</Page>
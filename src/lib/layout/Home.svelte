<script lang="ts">
    import FileUpload from "$lib/comp/FileUpload.svelte";
    import ProgressBar from "$lib/comp/ProgressBar.svelte";
    import LinkButton from "$lib/LinkButton.svelte";
    import { sampleStats } from "$lib/sampleStats";
    import { Stats, type StatsData } from "$lib/stats";

    export let setStats: (stats: Stats) => any;

    async function filesDropped(files: FileList) {
        const file = files[0];
        let data: any;

        try {
            data = JSON.parse(await file.text()) as StatsData;
        } catch(e) {
            return `Invalid file format: ${e}`;
        }
        
        if(typeof(data) == "object" && Array.isArray(data)) {
            return "Invalid file format: Expected Object got Array for root.";
        }

        if(!data["songs"]) {
            return "Invalid file format: missing 'songs' field";
        }

        if(!Array.isArray(data["songs"])) {
            return "Invalid file format: 'songs' must be an array";
        }

        setStats(new Stats(data));
    }
</script>

<style>
    #banner {
        text-align: center;
    }

    #banner h1 {
        font-size: 400%;
    }

    #home {
        animation: fade-in 1s;
    }
</style>

<div id="home">
    <div id="banner">
        <h1>SongWrap</h1>
    </div>

    <FileUpload label="Upload a stat file" onDropped={filesDropped} />

    <div style="text-align: center; padding: 10px;">
        <LinkButton text="Try a sample" onClick={() => setStats(new Stats(sampleStats))} highlight/>
    </div>

    <div>
        <h2>How to get the stats file?</h2>
        <p>
            Currently only Audacious with the <a href="https://github.com/Wolfyxon/AudaciousStats">AudaciousStats</a> plugin is supported, but
            you can create your own program or plugin to collect stats. <br/>
            See the <a href="https://github.com/wolfyxon/songwrap?tab=readme-ov-file#data-format">format specification</a>.
        </p>
    </div>
</div>
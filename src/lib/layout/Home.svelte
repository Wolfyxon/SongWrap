<script lang="ts">
    import FileUpload from "$lib/comp/FileUpload.svelte";
    import LinkButton from "$lib/LinkButton.svelte";
    import { sampleStats } from "$lib/sampleStats";
    import { parseStatsData, ProcessedStats, StatsProcessor, type StatsData, type StatsViewConfig } from "$lib/stats";

    export let setStats: (stats: ProcessedStats) => any;

    const statsConfig: StatsViewConfig = {
        songRankCount: 4,
        artistRankCount: 3
    };

    async function filesDropped(files: FileList) {
        const file = files[0];
        let data: StatsData;

        try {
            data = parseStatsData(await file.text());
        } catch (e) {
            return String(e);
        }
        
        const processor = new StatsProcessor(data);

        setStats(processor.getResult(statsConfig));
    }

    function getSampleStats(): ProcessedStats {
        return new StatsProcessor(sampleStats).getResult(statsConfig);
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
        <LinkButton text="Try a sample" onClick={() => setStats(getSampleStats())} highlight/>
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
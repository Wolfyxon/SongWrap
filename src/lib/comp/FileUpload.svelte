<script lang="ts">
    export let label: string | null = null;
</script>

<style>
    .file-upload {
        padding: 20px;
        border: var(--panel-outline) 2px solid;
    }

    .file-upload h1 {
        margin-top: 0;
    }
</style>

<div class="file-upload panel">
    {#if label}
        <h1>{label}</h1>
    {/if}

    Drag and drop a file or use <input type="file" />
</div>
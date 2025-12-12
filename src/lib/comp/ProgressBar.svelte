<script lang="ts">
    export let max: number = 100;
    export let value: number = 50;
</script>

<style>
    .progress-bar {
        width: 100%;
        background-color: var(--panel-dark);
        height: 10px;
        border-radius: 10px;
        margin-top: 5px;
    }

    .progress-bar-fill {
        background: linear-gradient(90deg, var(--colorA), var(--colorB), var(--colorC));
        border-radius: 10px;
        height: 100%;
        transition: 0.2s;
    }


</style>

<div class="progress-bar">
    <div class="progress-bar-fill" style={`width: ${(value / max) * 100}%`}></div>
</div>
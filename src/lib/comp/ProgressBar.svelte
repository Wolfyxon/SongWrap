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
        background-image: linear-gradient(
            90deg, 
            var(--colorA), 
            var(--colorB), 
            var(--colorC),
            var(--colorB), 
            var(--colorA)
        );
        background-size: 250% 250%;
        animation: bg-scroll-x 2s infinite linear forwards;
        border-radius: 10px;
        height: 100%;
        transition: 0.5s;
    }


</style>

<div class="progress-bar">
    <div 
        class="progress-bar-fill" 
        style={`width: ${Math.min(value / max, 1) * 100}%`}
    >
    </div>
</div>
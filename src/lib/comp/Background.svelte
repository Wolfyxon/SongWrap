<script lang="ts">
    type Ball = {
        color: string
    }

    const balls: Ball[] = [];

    for(let i = 0; i < 10; i++) {
        balls[i] = {
            color: "var(--colorA)"
        }
    }
</script>

<style>
    #background {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }

    .ball {
        position: absolute;
        top: 0;
        border-radius: 100%;
        filter: blur(100px);
        background-color: var(--color);
        width: 100px;
        height: 100px;
    }
</style>

<div id="background">
    {#each balls as ball}
        <div 
            class="ball" 
            style={`--color: ${ball.color}`}
        >
        </div>
    {/each}
</div>

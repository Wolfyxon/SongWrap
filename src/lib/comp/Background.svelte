<script lang="ts">
    import { randf } from "$lib/util/math";

    type Ball = {
        color: string,
        x: number,
        y: number
    }

    const balls: Ball[] = [];

    for(let i = 0; i < 10; i++) {
        balls[i] = {
            color: "var(--colorA)",
            x: randf(0, 100),
            y: randf(0, 100)
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
            style={`
                --color: ${ball.color};
                left: ${ball.x}%;
                top: ${ball.y}%; 
            `}
        >
        </div>
    {/each}
</div>

<script lang="ts">
    import { randf, randi } from "$lib/util/math";

    type Ball = {
        color: string,
        animTime: number,
        angleOffset: number,
        x: number,
        y: number
    }

    const balls: Ball[] = [];
    const colors = ["A", "B", "C"];

    for(let i = 0; i < 10; i++) {
        const colorLetter = colors[randi(0, colors.length - 1)];

        balls[i] = {
            color: `var(--color${colorLetter})`,
            animTime: randi(20, 60),
            angleOffset: randi(-360, 360),
            x: randf(-50, 100),
            y: randf(-50, 100)
        }
    }
</script>

<style>
    @keyframes orbit {
        0% {
            transform: rotate(0deg) rotate(var(--angle-offset)) translateX(0%);
        }
        50% {
            transform: rotate(360deg) rotate(var(--angle-offset)) translateX(100%);
        }
        100% {
            transform: rotate(0deg) rotate(var(--angle-offset)) translateX(0%);
        }
    }

    #background {
        position: absolute;
        overflow: hidden;
        opacity: 0.2;
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
        width: 35%;
        aspect-ratio: 1;
        animation: orbit var(--anim-time) infinite linear;
    }
</style>

<div id="background">
    {#each balls as ball}
        <div 
            class="ball" 
            style={`
                --color: ${ball.color};
                --anim-time: ${ball.animTime}s;
                --angle-offset: ${ball.angleOffset}deg;
                left: ${ball.x}%;
                top: ${ball.y}%; 
            `}
        >
        </div>
    {/each}
</div>

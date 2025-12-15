<script lang="ts">
    import { randf, randi } from "$lib/util/math";

    type Ball = {
        color: string,
        animTime: number,
        angleOffset: number,
        x: number,
        y: number
    }

    // Because Svelte does hydration and runs code both on server and client the background
    // causes performance overhead. Predefining the values instead of generating them improves the performance
    const balls: Ball[] = [
        {
            "color": "var(--colorB)",
            "animTime": 30,
            "angleOffset": 239,
            "x": -34.68883000295101,
            "y": 20.64092240419626
        },
        {
            "color": "var(--colorB)",
            "animTime": 31,
            "angleOffset": -41,
            "x": -19.024226765668917,
            "y": -9.060782161083281
        },
        {
            "color": "var(--colorA)",
            "animTime": 35,
            "angleOffset": 258,
            "x": 51.196863588930185,
            "y": -17.565847907771918
        },
        {
            "color": "var(--colorB)",
            "animTime": 23,
            "angleOffset": -120,
            "x": 65.78593303898998,
            "y": -35.60800792786095
        },
        {
            "color": "var(--colorA)",
            "animTime": 36,
            "angleOffset": 328,
            "x": 54.684785851248165,
            "y": 82.2700200282338
        },
        {
            "color": "var(--colorA)",
            "animTime": 33,
            "angleOffset": 92,
            "x": -11.72240430974901,
            "y": 72.2989712793111
        },
        {
            "color": "var(--colorA)",
            "animTime": 29,
            "angleOffset": 164,
            "x": 77.19160485740876,
            "y": -34.54608667316021
        },
        {
            "color": "var(--colorB)",
            "animTime": 36,
            "angleOffset": -313,
            "x": -6.932904159181717,
            "y": 8.22630932535747
        },
        {
            "color": "var(--colorA)",
            "animTime": 35,
            "angleOffset": -351,
            "x": 90.57252391848891,
            "y": 39.41473580403945
        },
        {
            "color": "var(--colorA)",
            "animTime": 27,
            "angleOffset": -218,
            "x": 10.475105802165196,
            "y": 72.44785765636968
        }
    ];
    /*const colors = ["A", "A", "B", "C"];

    for(let i = 0; i < 10; i++) {
        const colorLetter = colors[randi(0, colors.length - 1)];

        balls[i] = {
            color: `var(--color${colorLetter})`,
            animTime: randi(20, 40),
            angleOffset: randi(-360, 360),
            x: randf(-50, 100),
            y: randf(-50, 100)
        }
    }

    console.log(balls)*/
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
        filter: blur(4vw);
        opacity: 0.2;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }

    .ball {
        position: absolute;
        will-change: transform;
        border-radius: 100%;
        background-color: var(--color);
        width: 35vw;
        min-width: 200px;
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

<script lang="ts">
    export let value: number;
    export let label: string = ""
    export let duration: number = 3000;

    let displayValue: number = 0;

    if(!import.meta.env.SSR) {
        const start = performance.now();

        function animate(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);

            const ease = Math.pow(1 - progress, 2);
            displayValue = value - Math.round(ease * value);

            if(progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }
</script>

<style>
    .counter {
        text-align: center;
        min-width: 200px;
        width: fit-content;
    }

    .counter-value {
        font-weight: bold;
        font-size: 500%;
    }

    .counter-label {
        font-size: 150%;
        color: silver;
    }

</style>

<div class="counter">
    <div class="counter-value">
        {displayValue}
    </div>
    <div class="counter-label">
        {label}
    </div>
</div>

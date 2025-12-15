<script lang="ts">
    export let text: string;
    export let highlight: boolean = false;
    export let onClick: () => any = () => {};
    
    function beforeOnClick(e: Event) {
        e.preventDefault();
        onClick();
    }
</script>

<style>
    .link-btn {
        --bg: white;
        width: fit-content;
        transition: 0.1s;
        display: inline-block;
    }

    .link-btn.highlight {
        --bg: linear-gradient(90deg, var(--colorA), var(--colorB), var(--colorC));
    }

    .link-btn.highlight .link-btn-underline {
        height: 2px;
    }

    .link-btn:hover {
        opacity: 0.8;
    }

    .link-btn-button {
        width: fit-content;
        min-width: 0;
        background: var(--bg);
        background-clip: text;
        border: none;
        font-size: 100%;
        padding: 0;
        color: transparent;
        opacity: 1;
    }

    .link-btn-underline {
        background: var(--bg);
        margin-top: -2px;
        height: 1px;
        width: 100%;
    }
</style>

<div class="link-btn" class:highlight={highlight}>
    <button class="link-btn-button" onclick={beforeOnClick}>
        {text}
    </button>
    <div class="link-btn-underline"></div>
</div>
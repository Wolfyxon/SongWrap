<script lang="ts">
    export let text: string;
    export let onClick: () => any = () => {};
    
</script>

<style>
    .link-btn {
        --gradient: linear-gradient(90deg, var(--colorA), var(--colorB), var(--colorC));
        width: fit-content;
        transition: 0.1s;
        display: inline-block;
    }

    .link-btn:hover {
        opacity: 0.8;
    }

    .link-btn-a {
        background: var(--gradient);
        background-clip: text;
        color: transparent;
    }

    .link-btn-a {
        opacity: 1;
    }

    .link-btn-underline {
        background: var(--gradient);
        height: 2px;
        width: 100%;
    }
</style>

<div class="link-btn">
    <a href="javascript:void(0)" class="link-btn-a" onclick={onClick}>
        {text}
    </a>
    <div class="link-btn-underline"></div>
</div>
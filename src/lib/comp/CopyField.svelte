<script lang="ts">
    import copyImg from "$lib/assets/copy.svg";

    export let value: string;

    function copy() {
        navigator.clipboard.writeText(value);
    }
</script>

<style>
    .copy-field {
        display: flex;
        padding: 5px;
        border: 1px solid var(--panel-outline);
        background-color: var(--panel-dark);
        border-radius: 10px;
        margin: 10px 0;
        gap: 10px;
        white-space: nowrap;
    }

    .copy-field-text {
        opacity: 0.8;
        padding: 15px;
        flex: 1;
        overflow: scroll;
    }

    .copy-field-btn {
        padding: 5px;
        width: 4em;
        min-width: fit-content;
        border-radius: 5px;
        opacity: 0.5;
        transition: 0.15s;
        cursor: pointer;
    }

    .copy-field-btn:hover {
        background: none;
        opacity: 1;
    }

    .copy-field-btn:active {
        opacity: 0.9;
    }

    .copy-field-btn img {
        height: 100%;
        transition: 0.15s;
    }

    .copy-field-btn:active img {
        scale: 0.9;
    }

</style>

<div class="copy-field">
    <div class="copy-field-text">
        {value}
    </div>
    <button class="copy-field-btn" onclick={copy}>
        <img 
            src={copyImg}
            alt="Copy"
        />
    </button>
</div>
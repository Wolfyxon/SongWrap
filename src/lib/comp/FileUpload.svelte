<script lang="ts">
    import { error } from '@sveltejs/kit';
    import { onMount } from 'svelte'

    type OnDroppedCallbackResult = void | string | string[];
    type OnDroppedCallback = (files: FileList) => OnDroppedCallbackResult | Promise<OnDroppedCallbackResult>;

    export let label: string | null = null;
    let errorString = "";

    export let onDropped: OnDroppedCallback = (files) => {
        console.warn("Files were dropped but 'onDropped' callback is not set");
        console.log(files);
        
        return "Wolfyxon forgot to implement this";
    };
    
    let fileHover = false;

    // TODO: Error display

    async function filesDropped(files: FileList | null | undefined) {
        if(!files || files.length == 0)
            return;

        const errorRes: OnDroppedCallbackResult = await onDropped(files);
        const errType = typeof(errorRes);

        switch(errType) {
            case "undefined":
                errorString = "";
                break;
            case "string":
                errorString = errorRes as string;
                break;
            case "object":
                if(Array.isArray(errorRes)) {
                    errorString = errorRes.join("\n");
                }
            
                break;
        }
    }

    function inputChange(e: Event) {
        const target = e.target as HTMLInputElement;
        filesDropped(target.files);
    }

    onMount(() => {
        window.addEventListener("drop", (e) => {
            const target = e.target as HTMLElement;
            fileHover = false;

            if(target.tagName == "INPUT")
                return;
            
            e.preventDefault();
            filesDropped(e.dataTransfer?.files);
        });

        window.addEventListener("dragover", (e) => {
            e.preventDefault();
            fileHover = true;
        });

        window.addEventListener("dragleave", (e) => {
            fileHover = false;
        });
    });

</script>

<style>    
    .file-upload {
        text-align: center;
        border: var(--panel-outline) 2px solid;
        transition: 0.25s;
    }

    .file-upload.file-hover {
        background-color: var(--panel-outline);
        scale: 1.05;
    }

    .file-upload.file-hover .file-upload-content {
        animation: none;
    }

    .file-upload-content {
        animation: flash 2s infinite;
        padding: 20px;
    }

    .file-upload-content h1 {
        margin: 0;
    }

    .file-upload-error {
        color: red;
        height: 2em;
    }

</style>

<div class="file-upload panel" class:file-hover={fileHover}>
    <div class="file-upload-content">
        {#if label}
            <h1>{label}</h1>
        {/if}

        <div class="file-upload-error">
            {errorString}
        </div>
        <div>
            Drag and drop a file or use <input type="file" onchange={inputChange} aria-label="file picker" />
        </div>
    </div>
</div>

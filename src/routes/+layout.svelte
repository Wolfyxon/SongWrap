<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
    import Background from '$lib/comp/Background.svelte';
	
	import GlobalStyle from "$lib/styles/global.svelte";
	import AnimStyle from "$lib/styles/anim.svelte";

	let { children } = $props();
</script>

<svelte:head>
	<title>SongWrap</title>
	<meta name="description" content="Import, view and share your listening habits in a fancy way! All free and open source." />
	<link rel="icon" href={favicon} />

	<GlobalStyle/>
	<AnimStyle />
	
</svelte:head>

<Background />
{@render children()}

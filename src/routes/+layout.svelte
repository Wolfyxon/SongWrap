<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
    import Background from '$lib/comp/Background.svelte';
    import Footer from '$lib/comp/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>SongWrap</title>
	<meta name="description" content="Import and view your listening stats in a fancy way." />

	<link rel="icon" href={favicon} />
	<link rel="stylesheet" href="/styles/global.css" />
</svelte:head>

<Background />
{@render children()}

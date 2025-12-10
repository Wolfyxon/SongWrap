<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
    import Background from '$lib/comp/Background.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="stylesheet" href="/styles/global.css" />
</svelte:head>

<Background />
{@render children()}

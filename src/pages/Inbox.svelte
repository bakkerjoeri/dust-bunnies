<script lang="ts">
	import TaskList from "../components/TaskList.svelte";
	import Page from "../layouts/Page.svelte";
	import { inbox } from "../store/tasks";
</script>

<Page>
	<h1>Inbox</h1>
	{$inbox.length} items

	{#if $inbox.length > 0}
		<TaskList tasks={$inbox} />
	{/if}
</Page>

<script lang="ts">
	import TaskList from "../components/TaskList.svelte";
	import Page from "../layouts/Page.svelte";
	import { tasksInLogbook } from "../store/tasks";
</script>

<Page>
	<h1>Logbook</h1>
	{$tasksInLogbook.length} items

	{#if $tasksInLogbook.length > 0}
		<TaskList tasks={$tasksInLogbook} />
	{/if}
</Page>

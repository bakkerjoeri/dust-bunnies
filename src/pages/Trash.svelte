<script lang="ts">
	import TaskList from "../components/TaskList.svelte";
	import Page from "../layouts/Page.svelte";
	import { tasksInTrash } from "../store/tasks";
</script>

<Page>
	<h1>Trash</h1>
	{$tasksInTrash.length} items

	{#if $tasksInTrash.length > 0}
		<TaskList tasks={$tasksInTrash} />
	{/if}
</Page>

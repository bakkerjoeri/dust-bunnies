<script lang="ts">
	import TaskList from "../components/TaskList.svelte";
	import Page from "../layouts/Page.svelte";
	import { tasksForSomeday } from "../store/tasks";
</script>

<Page>
	<h1>Someday</h1>
	{$tasksForSomeday.length} items

	{#if $tasksForSomeday.length > 0}
		<TaskList tasks={$tasksForSomeday} />
	{/if}
</Page>

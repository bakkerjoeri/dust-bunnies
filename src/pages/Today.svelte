<script lang="ts">
	import TaskList from "../components/TaskList.svelte";
	import Page from "../layouts/Page.svelte";
	import { tasksForToday } from "../store/tasks";
</script>

<Page>
	<h1>Today</h1>
	{$tasksForToday.length} items

	{#if $tasksForToday.length > 0}
		<TaskList tasks={$tasksForToday} />
	{/if}
</Page>

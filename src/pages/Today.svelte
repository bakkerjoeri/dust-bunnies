<script lang="ts">
	import TaskList from "../components/TaskList.svelte";
	import Page from "../layouts/Page.svelte";
	import {
		addRootTask,
		createTask,
		selectedTaskId,
		tasksForToday,
	} from "../store/tasks";

	let actions = [
		{
			label: "Add here",
			callback: addTaskHere,
		},
	];

	function addTaskHere() {
		const newTask = createTask({
			deferType: "date",
			deferredTo: new Date().valueOf(),
		});

		addRootTask(newTask);
		$selectedTaskId = newTask.id;
	}
</script>

<Page {actions}>
	<h1>Today</h1>
	{$tasksForToday.length} items

	{#if $tasksForToday.length > 0}
		<TaskList tasks={$tasksForToday} />
	{:else}
		<p>Looks like you're done for today. Enjoy!</p>
	{/if}
</Page>

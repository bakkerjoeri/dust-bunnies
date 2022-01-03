<script lang="ts">
	import TaskList from "../components/TaskList.svelte";
	import Page from "../layouts/Page.svelte";
	import {
		addTask,
		createTask,
		selectedTaskId,
		tasksForSomeday,
	} from "../store/tasks";

	let actions = [
		{
			label: "Add here",
			callback: addTaskHere,
		},
	];

	function addTaskHere() {
		const newTask = createTask({
			deferType: "someday",
		});

		addTask(newTask);
		$selectedTaskId = newTask.id;
	}
</script>

<Page {actions}>
	<h1>Someday</h1>
	{$tasksForSomeday.length} items

	{#if $tasksForSomeday.length > 0}
		<TaskList tasks={$tasksForSomeday} />
	{/if}
</Page>

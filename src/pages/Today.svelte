<script lang="ts">
	import TagSelect from "../components/TagSelect.svelte";
	import TaskList from "../components/TaskList.svelte";
	import Page from "../layouts/Page.svelte";
	import {
		addTask,
		createTask,
		selectedTaskId,
		tasksForToday,
	} from "../store/tasks";
	import { getTagsSortedByCount } from "../store/tags";

	let actions = [
		{
			label: "Add here",
			callback: addTaskHere,
		},
	];

	let filteringByTag = null;
	$: tagsOfTasks = getTagsSortedByCount($tasksForToday);
	$: filteredTasks = $tasksForToday.filter((task) => {
		if (filteringByTag === null) {
			return task;
		}

		return task.tags.some((tag) => {
			return filteringByTag === tag;
		});
	});

	function addTaskHere() {
		const newTask = createTask({
			deferType: "date",
			deferredTo: new Date().valueOf(),
		});

		addTask(newTask);
		$selectedTaskId = newTask.id;
	}
</script>

<Page {actions}>
	<h1>Today</h1>
	{$tasksForToday.length} items

	{#if tagsOfTasks.length}
		<TagSelect tags={tagsOfTasks} bind:selected={filteringByTag} />
	{/if}

	{#if $tasksForToday.length > 0}
		<TaskList tasks={filteredTasks} />
	{:else}
		<p>Looks like you're done for today. Enjoy!</p>
	{/if}
</Page>

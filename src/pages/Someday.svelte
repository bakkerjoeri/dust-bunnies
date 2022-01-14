<script lang="ts">
	import TaskList from "../components/TaskList.svelte";
	import TagSelect from "../components/TagSelect.svelte";
	import Page from "../layouts/Page.svelte";
	import {
		addTask,
		createTask,
		selectedTaskId,
		tasksForSomeday,
	} from "../store/tasks";
	import { getTagsSortedByCount } from "../store/tags";

	let filteringByTag = null;
	$: tagsOfTasks = getTagsSortedByCount($tasksForSomeday);
	$: filteredTasks = $tasksForSomeday.filter((task) => {
		if (filteringByTag === null) {
			return task;
		}

		return task.tags.some((tag) => {
			return filteringByTag === tag;
		});
	});

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

	{#if tagsOfTasks.length}
		<TagSelect tags={tagsOfTasks} bind:selected={filteringByTag} />
	{/if}

	{#if filteredTasks.length > 0}
		<TaskList tasks={filteredTasks} />
	{/if}
</Page>

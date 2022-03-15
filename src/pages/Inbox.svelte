<script lang="ts">
	import TaskList from "../components/TaskList.svelte";
	import Page from "../layouts/Page.svelte";
	import TagSelect from "../components/TagSelect.svelte";
	import { inbox } from "../store/tasks";
	import { getTagsSortedByCount } from "../store/tags";

	let filteringByTag = null;
	$: tagsOfTasks = getTagsSortedByCount($inbox);
	$: filteredTasks = $inbox.filter((task) => {
		if (filteringByTag === null) {
			return task;
		}

		return task.tags.some((tag) => {
			return filteringByTag === tag;
		});
	});
</script>

<Page>
	<h1>Inbox</h1>
	{$inbox.length} items

	{#if tagsOfTasks.length || filteringByTag}
		<TagSelect tags={tagsOfTasks} bind:selected={filteringByTag} />
	{/if}

	{#if filteredTasks.length > 0}
		<TaskList tasks={filteredTasks} />
	{/if}
</Page>

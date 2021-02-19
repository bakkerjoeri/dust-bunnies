<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import type { Task } from "./../store/tasks";

	export let task: Task;

	const dispatch = createEventDispatcher<{
		'delete': Task,
		'update': Partial<Task>,
	}>();

	function handleUpdate() {
		dispatch('update', task);
	}
</script>

<input
	type="checkbox"
	bind:checked={task.isDone}
	on:change={handleUpdate}
/>

<input
	type="text"
	bind:value={task.title}
	on:change={handleUpdate}
/>

<button on:click={() => dispatch('delete', task)}>
	delete
</button>

<script lang="ts">
	import { createTask, Task, tasks } from "./../store/tasks";
	import TaskList from "./TaskList.svelte";

	export let task: Task;

	let areSubtasksVisible = false;

	$: subtasks = task.subtaskIds.map((id) =>
		$tasks.find((task) => task.id === id)
	);

	function onClickAddSubtask() {
		const newTask = createTask();
		tasks.add(newTask);
		tasks.patch(task.id, {
			subtaskIds: [...task.subtaskIds, newTask.id],
		});
	}

	function toggleSubtaskVisibility() {
		areSubtasksVisible = !areSubtasksVisible;
	}
</script>

<div class="task">
	{#if subtasks.length > 0}
		<button
			on:click={toggleSubtaskVisibility}
			class="button-toggle-subtasks"
		>
			{#if areSubtasksVisible}
				▼
			{:else}
				▶
			{/if}
		</button>
	{/if}

	<input
		id={`task-checkbox-${task.id}`}
		type="checkbox"
		checked={task.status === "done"}
		indeterminate={task.status === "dropped"}
	/>

	<div class="title">
		<label for={`task-checkbox-${task.id}`}>
			{#if task.title.length > 0}
				{task.title}
			{:else}
				New task
			{/if}
		</label>
	</div>

	<div class="options">
		<button on:click={onClickAddSubtask}>Add subtask</button>
	</div>
</div>

{#if subtasks.length > 0 && areSubtasksVisible}
	<div class="subtasks">
		<TaskList tasks={subtasks} />
	</div>
{/if}

<style>
	.task {
		display: grid;
		grid-template-columns: 26px 26px 1fr max-content;
	}

	.button-toggle-subtasks {
		grid-column: 1 / 2;
		background-color: transparent;
		border: none;
	}

	input[type="checkbox"] {
		grid-column: 2 / 3;
		justify-self: center;
	}

	.title {
		grid-column: 3 / 4;
		line-height: 26px;
	}

	.options {
		grid-column: 4 / 5;
	}

	.subtasks {
		padding-left: 26px;
	}
</style>

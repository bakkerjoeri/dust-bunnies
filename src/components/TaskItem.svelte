<script lang="ts">
	import { createTask, selectedTaskId, Task, tasks } from "./../store/tasks";
	import TaskList from "./TaskList.svelte";

	export let task: Task;

	let areSubtasksVisible = false;
	let isEditing = false;
	let titleDraft = "";
	let titleInput: HTMLInputElement;

	$: isSelected = $selectedTaskId === task.id;
	$: subtasks = task.subtaskIds.map((id) =>
		$tasks.find((task) => task.id === id)
	);

	$: if (isEditing && $selectedTaskId !== task.id) {
		saveChangesToTitle();
		stopEditing();
	}

	$: if (isEditing && titleInput) {
		updateTitleDraft();
		titleInput.focus();
		titleInput.select();
	}

	function saveChangesToTitle() {
		tasks.patch(task.id, { title: titleDraft });
	}

	function select() {
		$selectedTaskId = task.id;
	}

	function deselect() {
		$selectedTaskId = null;
	}

	function startEditing() {
		isEditing = true;
	}

	function stopEditing() {
		isEditing = false;
	}

	function updateTitleDraft() {
		titleDraft = task.title;
	}

	function onSubmitTitleForm() {
		saveChangesToTitle();
		stopEditing();
	}

	function onKeyDown(event: KeyboardEvent) {
		if (event.key === "Escape" && isEditing) {
			event.preventDefault();
			stopEditing();
			return;
		}

		if (event.key === "Escape" && isSelected) {
			event.preventDefault();
			deselect();
			return;
		}

		if (
			isSelected &&
			!isEditing &&
			event.key === "Enter" &&
			event.metaKey
		) {
			event.preventDefault();
			startEditing();
			return;
		}

		if (isEditing && event.key === "Enter") {
			event.preventDefault();
			saveChangesToTitle();
			stopEditing();
			return;
		}
	}

	function onClickTask() {
		if (isSelected) {
			startEditing();
		} else {
			select();
		}
	}

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

<svelte:window on:keydown={onKeyDown} />

<div class="task" class:is-selected={isSelected}>
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

	<div class="title" on:click={onClickTask}>
		{#if isEditing}
			<form on:submit={onSubmitTitleForm}>
				<input
					type="text"
					bind:value={titleDraft}
					bind:this={titleInput}
				/>
			</form>
		{:else}
			<label for={`task-checkbox-${task.id}`} on:click|preventDefault>
				{#if task.title.length > 0}
					{task.title}
				{:else}
					New task
				{/if}
			</label>
		{/if}
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

<style lang="scss">
	.task {
		display: grid;
		grid-template-columns: 26px 26px 1fr max-content;

		&.is-selected {
			background-color: rgb(213, 238, 255);
		}
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

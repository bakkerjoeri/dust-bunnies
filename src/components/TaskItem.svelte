<script lang="ts">
	import { fuzzyFutureDifference } from "../utilities/dates";
	import {
		addSubtask,
		createTask,
		patchTask,
		selectedTaskId,
		Task,
		tasks,
	} from "./../store/tasks";
import DueLabel from "./DueLabel.svelte";
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
		patchTask(task.id, { title: titleDraft });
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

	function onClickCheckbox() {
		if (task.status === "done" || task.status === "dropped") {
			patchTask(task.id, { status: "inProgress" });
		} else {
			patchTask(task.id, { status: "done" });
		}
	}

	function onSubmitTitleForm() {
		saveChangesToTitle();
		stopEditing();
	}

	function onKeyDown(event: KeyboardEvent) {
		var inputs = ["input", "select", "button", "textarea"];

		if (
			document.activeElement &&
			inputs.includes(document.activeElement.tagName.toLowerCase())
		) {
			return;
		}

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
			event.key === "Enter" &&
			event.metaKey &&
			isSelected &&
			!isEditing
		) {
			event.preventDefault();
			startEditing();
			return;
		}

		if (event.key === "Enter" && isEditing) {
			event.preventDefault();
			saveChangesToTitle();
			stopEditing();
			return;
		}

		if (event.key === " " && !event.altKey && isSelected && !isEditing) {
			event.preventDefault();

			if (task.status === "done") {
				patchTask(task.id, { status: "inProgress" });
			} else {
				patchTask(task.id, { status: "done" });
			}

			return;
		}

		if (
			((event.key === " " && event.altKey) || event.key === " ") &&
			isSelected &&
			!isEditing
		) {
			event.preventDefault();

			if (task.status === "dropped") {
				patchTask(task.id, { status: "inProgress" });
			} else {
				patchTask(task.id, { status: "dropped" });
			}

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
		addSubtask(task.id, newTask);
		areSubtasksVisible = true;
		$selectedTaskId = newTask.id;
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
		on:click|preventDefault={onClickCheckbox}
	/>

	<div
		class="title"
		class:is-placeholder={task.title.length === 0}
		on:click={onClickTask}
	>
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
					<span class="placeholder">New task</span>
				{/if}
			</label>
		{/if}
	</div>

	{#if task.status === "inProgress" && task.due !== null}
		<div class="due">
			<DueLabel due={task.due}/>
		</div>
	{/if}

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
		grid-template-columns: 26px 26px 1fr max-content max-content;

		&.is-selected {
			background-color: rgb(213, 238, 255);
		}
	}

	.button-toggle-subtasks {
		grid-column: 1 / 2;
		background-color: transparent;
		border: none;
		height: var(--baseline);
		color: var(--color-text-soft);
	}

	input[type="checkbox"] {
		grid-column: 2 / 3;
		justify-self: center;
		align-self: baseline;
		height: var(--baseline);
	}

	.title {
		grid-column: 3 / 4;
		line-height: var(--baseline);
	}

	.placeholder {
		opacity: 0.5;
	}

	.due {
		grid-column: 4 / 5;
		padding-left: 15px;
		padding-right: 15px;
	}

	.options {
		grid-column: 5 / 6;
	}

	.subtasks {
		padding-left: 26px;
	}
</style>

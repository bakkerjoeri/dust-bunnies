<script lang="ts">
	import { caretRight, caretDown } from 'svelte-awesome/icons';
	import { tick } from "svelte";
	import Icon from 'svelte-awesome';
	import TaskList from "./TaskList.svelte";
	import  { taskBeingEdited, tasks, taskWithFocus } from "./../store/tasks";
	import type { Task } from "./../store/tasks";

	export let task: Task;
	export let hasFocus: boolean;
	export let isEditing: boolean;

	$: {
		if (isEditing) {
			focus();
		}
	}

	let isShowingSubtasks: boolean = false;
	let taskInput: HTMLInputElement;

	function handleClickLabel() {
		if ($taskWithFocus !== task) {
			$taskWithFocus = task;
			$taskBeingEdited = null;
			return;
		}

		$taskBeingEdited = task;
	}

	function handleUpdate() {
		tasks.patch('update', task);
	}

	function handleBlurInput() {
		$taskBeingEdited = null;
	}

	export async function focus() {
		await tick();

		if (!taskInput) {
			return;
		}

		taskInput.focus();
		taskInput.select();
	}
</script>

<div
	class="Task"
	class:has-focus={hasFocus}
	class:is-editing={isEditing}
>
	{#if task.subTasks.length}
		<button class="Task__caret" on:click={() => isShowingSubtasks = !isShowingSubtasks}>
			{#if isShowingSubtasks}
				<Icon data={caretDown}/>
			{:else}
				<Icon data={caretRight}/>
			{/if}
		</button>
	{/if}

	<input
		class="Task__status"
		type="checkbox"
		bind:checked={task.isDone}
		on:change={handleUpdate}
	/>

	{#if isEditing}
		<input
			class="Task__label Task__input"
			type="text"
			bind:this={taskInput}
			bind:value={task.title}
			on:change={handleUpdate}
			on:blur={handleBlurInput}
		/>
	{:else}
		<span class="Task__label" on:click={handleClickLabel}>
			{task.title}
		</span>
	{/if}

	{#if task.subTasks.length && isShowingSubtasks}
		<div class="Task__subtasks">
			<TaskList tasks={task.subTasks}/>
		</div>
	{/if}
</div>

<style lang="scss">
	.Task {
		display: grid;
		grid-template-rows: 26px min-content;
		grid-template-columns: 26px 26px 1fr;
		align-items: center;

		&.has-focus {
			background-color: antiquewhite;
		}
	}

	.Task__caret {
		grid-row: 1;
		grid-column: 1;
		margin: 0;
		padding: 0;
		width: 26px;
		height: 26px;
		background-color: transparent;
		border: 0;
	}

	.Task__status {
		grid-row: 1;
		grid-column: 2;
	}

	.Task__label {
		grid-row: 1;
		grid-column: 3;
		font-family: sans-serif;
		line-height: 26px;
		height: 26px;
	}

	.Task__input {
		font-size: inherit;
	}

	.Task__subtasks {
		grid-row: 2;
		grid-column: 2 / 4;
	}
</style>

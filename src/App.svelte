<script lang="ts">
	import { createEmptyTask, tasks, displayMode, taskWithFocus, taskBeingEdited, visibleTasks } from "./store/tasks";
	import type { Task } from "./store/tasks";
	import { clamp } from "./utilities/clamp";
	import { arrayMove } from "./utilities/arrayMove";
	import TaskList from "./components/TaskList.svelte";

	function handleClickNewTask() {
		const task = createEmptyTask();
		tasks.addTask(task);
		startEditingTask(task);
	}

	function startEditingTask(task: Task) {
		$taskWithFocus = task;
		$taskBeingEdited = task;
	}

	async function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowUp' && !event.altKey && !event.metaKey && !$taskBeingEdited) {
			event.preventDefault();
			moveFocus(-1);
			return;
		}

		if (event.key === 'ArrowDown' && !event.altKey && event.metaKey && !$taskBeingEdited) {
			event.preventDefault();
			moveFocus(Infinity);
			return;
		}

		if (event.key === 'ArrowUp' && !event.altKey && event.metaKey && !$taskBeingEdited) {
			event.preventDefault();
			moveFocus(-Infinity);
			return;
		}

		if (event.key === 'ArrowDown' && !event.altKey && !event.metaKey && !$taskBeingEdited) {
			event.preventDefault();
			moveFocus(1);
			return;
		}

		if (event.key === 'ArrowUp' && event.altKey && $taskWithFocus && !$taskBeingEdited) {
			event.preventDefault();
			moveTaskUp($taskWithFocus);
			return;
		}

		if (event.key === 'ArrowDown' && event.altKey && $taskWithFocus && !$taskBeingEdited) {
			event.preventDefault();
			moveTaskDown($taskWithFocus);
			return;
		}

		if (
			event.key === 'Enter' && event.metaKey && $taskWithFocus && !$taskBeingEdited) {
			event.preventDefault();
			startEditingTask($taskWithFocus);
			return;
		}

		if (event.key === 'Enter' && !event.shiftKey && $taskBeingEdited) {
			event.preventDefault();
			$taskBeingEdited = null;
			return;
		}

		if (event.key === 'Enter' && !event.shiftKey && $taskWithFocus) {
			event.preventDefault();
			const newTask = createEmptyTask();
			tasks.insertTask(newTask, $visibleTasks.indexOf($taskWithFocus) + 1);
			startEditingTask(newTask);
			return;
		}

		if (event.key === ' ' && $taskWithFocus && !$taskBeingEdited) {
			event.preventDefault();
			tasks.patch($taskWithFocus.id, { isDone: $taskWithFocus.isDone });
			return;
		}

		if (event.key === 'Backspace' && $taskWithFocus && !$taskBeingEdited) {
			event.preventDefault();
			tasks.deleteTask($taskWithFocus.id);
			moveFocus(-1);
			return;
		}

		if (event.key === 'Tab' && !event.shiftKey && $taskWithFocus && !$taskBeingEdited) {
			event.preventDefault();
			indentTask($taskWithFocus.id);
		}
	}

	function moveFocus(offset: number) {
		if ($tasks.length === 0) {
			return;
		}

		if (!$taskWithFocus && $tasks.length > 0) {
			$taskWithFocus = $tasks[0];
			return;
		}

		const focusIndex = $visibleTasks.indexOf($taskWithFocus);
		const minIndex = 0;
		const maxIndex = $tasks.length - 1;
		const taskWithNextFocus = $tasks[clamp(focusIndex + offset, minIndex, maxIndex)];

		$taskWithFocus = taskWithNextFocus;
	}

	function moveTaskUp(task: Task) {
		if (!$taskWithFocus) {
			return;
		}

		const taskWithFocusIndex = $visibleTasks.indexOf($taskWithFocus);

		if (taskWithFocusIndex === 0) {
			return;
		}

		$tasks = arrayMove($tasks, taskWithFocusIndex, taskWithFocusIndex - 1);
	}

	function moveTaskDown(task: Task) {
		if (!$taskWithFocus) {
			return;
		}

		const taskWithFocusIndex = $visibleTasks.indexOf($taskWithFocus);

		if (taskWithFocusIndex === 0) {
			return;
		}

		$tasks = arrayMove($tasks, taskWithFocusIndex, taskWithFocusIndex + 1);
	}

	function indentTask(taskId: Task['id']) {
		const task = $tasks.find(task => task.id === taskId);

		if (!task) {
			return;
		}

		const taskIndex = $tasks.indexOf(task);
		const taskAbove = $tasks[taskIndex - 1];

		tasks.deleteTask(taskId);
		taskAbove.subTasks.push(task);
	}
</script>

<svelte:window on:keydown={handleKeydown}/>

<div class="App">
	<header>
		<div class="DisplayMode">
			<div class="DisplayMode__item">
				<input id="displayMode-remaining" type="radio" bind:group={$displayMode} value="remaining">
				<label for="displayMode-remaining">Remaining</label>
			</div>

			<div class="DisplayMode__item">
				<input id="displayMode-all" type="radio" bind:group={$displayMode} value="all">
				<label for="displayMode-all">All</label>
			</div>
		</div>
	</header>

	<main>
		<TaskList tasks={$tasks}/>

		<button on:click={handleClickNewTask}>
			New task
		</button>
	</main>
</div>

<style lang="scss">
	.App {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 30px 1fr;
		gap: 20px;
		padding: 20px;
		height: 100%;
	}

	header {
		grid-row: 1;
		align-self: center;
	}

	main {
		grid-row: 2;
	}

	.DisplayMode__item + .DisplayMode__item {
		margin-left: 15px;
	}

	.DisplayMode {
		display: flex;
	}
</style>

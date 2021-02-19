<script lang="ts">
	import TaskItem from "./components/TaskItem.svelte";
	import { createEmptyTask, tasks } from "./store/tasks";
	import type { Task } from "./store/tasks";

	type DisplayMode = 'all' | 'remaining' | 'available' | 'nextUp';

	let selectedTaskId: Task['id'] | null = null;
	let displayMode: DisplayMode = 'all';

	$: selectedTask = $tasks.find(task => task.id === selectedTaskId);
	$: selectedTaskIndex = $tasks.findIndex(task => task.id === selectedTaskId);
	$: visibleTasks = $tasks.filter(task => {
		if (displayMode === 'remaining') {
			return !task.isDone;
		}

		return true;
	});

	function addTask(task: Task): void {
		$tasks = [
			...$tasks,
			createEmptyTask(),
		];
	}

	function insertTaskAtIndex(task: Task, index: number): void {
		$tasks = [
			...$tasks.slice(0, index + 1),
			task,
			...$tasks.slice(index + 1),
		]
	}

	function updateTask(id: Task['id'], newData: Partial<Task>): void {
		tasks.update(tasks => {
			return tasks.map(task => {
				if (task.id === id) {
					return { ...task, ...newData };
				}

				return task;
			});
		});
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowUp' && event.altKey && selectedTask) {
			moveTaskUp(selectedTask);
		}

		if (event.key === 'ArrowDown' && event.altKey && selectedTask) {
			moveTaskDown(selectedTask);
		}

		if (event.key === 'Enter' && selectedTaskIndex !== -1) {
			insertTaskAtIndex(createEmptyTask(), selectedTaskIndex);
		}
	}

	function moveTaskUp(task: Task) {
		const currentIndex = $tasks.indexOf(task);

		if (selectedTaskIndex === -1 || selectedTaskIndex === 0) {
			return;
		}

		$tasks = arrayMove($tasks, selectedTaskIndex, selectedTaskIndex - 1);
	}

	function moveTaskDown(task: Task) {
		const currentIndex = $tasks.indexOf(task);

		if (selectedTaskIndex === -1 || selectedTaskIndex === $tasks.length - 1) {
			return;
		}

		$tasks = arrayMove($tasks, selectedTaskIndex, selectedTaskIndex + 1);
	}

	function arrayMove<T>(array: T[], from: number, to: number): T[] {
		array = [...array];

		const startIndex = from < 0 ? array.length + from : from;

		if (startIndex >= 0 && startIndex < array.length) {
			const endIndex = to < 0 ? array.length + to : to;

			const [item] = array.splice(from, 1);
			array.splice(endIndex, 0, item);
		}

		return array;
	}
</script>

<svelte:window on:keydown={handleKeydown}/>

<div class="App">
	<main>
		<div class="DisplayMode">
			<div class="DisplayMode__item">
				<input id="displayMode-remaining" type="radio" bind:group={displayMode} value="remaining">
				<label for="displayMode-remaining">Remaining</label>
			</div>

			<div class="DisplayMode__item">
				<input id="displayMode-all" type="radio" bind:group={displayMode} value="all">
				<label for="displayMode-all">All</label>
			</div>
		</div>

		<ul>
			{#each visibleTasks as task (task.id)}
				<li on:click={() => { selectedTaskId = task.id }}>
					<TaskItem
						task={task}
						on:update={(event) => updateTask(task.id, event.detail)}
						on:delete={() => tasks.deleteTask(task.id)}
					/>
				</li>
			{/each}
		</ul>

		<button on:click={() => addTask(createEmptyTask())}>
			New task
		</button>
	</main>
</div>

<style>
	.App {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		gap: 20px;
		height: 100%;
	}

	main {
		justify-self: center;
	}

	aside {
		border-left: 1px solid lightgray;
	}

	.DisplayMode__item + .DisplayMode__item {
		margin-left: 15px;
	}

	.DisplayMode {
		display: flex;
	}
</style>

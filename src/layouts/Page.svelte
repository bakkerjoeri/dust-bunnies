<script lang="ts">
	import TaskForm from "../components/TaskForm.svelte";
	import {
		createTask,
		rootTaskIds,
		tasks,
		selectedTask,
		selectedTaskId,
		tasksInTrash,
		patchTask,
	} from "../store/tasks";
	import { link } from "svelte-routing";

	function onClickAddNewTask() {
		const newTask = createTask();

		$tasks = [...$tasks, newTask];
		$rootTaskIds = [...$rootTaskIds, newTask.id];
		$selectedTaskId = newTask.id;
	}
</script>

<div class="page">
	<nav>
		<ul>
			<li>
				<a href="/" use:link>Inbox</a>
			</li>

			<li>
				<a href="/today" use:link>Today</a>
			</li>

			<li>
				<a href="/someday" use:link>Someday</a>
			</li>

			<li>
				<a href="/logbook" use:link>Logbook</a>
			</li>

			{#if $tasksInTrash.length > 0}
				<li>
					<a href="/trash" use:link>Trash</a>
				</li>
			{/if}
		</ul>
	</nav>
	<header>
		<button on:click={onClickAddNewTask}>Add new task to inbox</button>
	</header>

	<main>
		<slot />
	</main>

	{#if $selectedTask}
		<aside>
			<TaskForm
				title={$selectedTask.title}
				notes={$selectedTask.notes}
				tags={$selectedTask.tags}
				status={$selectedTask.status}
				deferType={$selectedTask.deferType}
				deferredTo={$selectedTask.deferredTo}
				on:save={({ detail: newValue }) => {
					console.log("Saving...", $selectedTask.id, newValue);
					patchTask($selectedTask.id, newValue);
				}}
			/>
		</aside>
	{/if}
</div>

<style lang="scss">
	.page {
		display: grid;
		grid-template-columns: auto 1fr auto;
		grid-template-rows: calc(1 * var(--baseline)) 1fr;
		grid-gap: var(--baseline);
		padding: var(--baseline);
	}

	nav {
		grid-column: 1 / 2;
		grid-row: 2 / -1;
	}

	header {
		grid-column: 1 / -1;
		grid-row: 1 / 2;
	}

	main {
		grid-column: 2 / 3;
		grid-row: 2 / 3;
	}

	aside {
		grid-column: 3 / 4;
		grid-row: 2 / 3;

		width: 400px;
	}
</style>

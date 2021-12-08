<script lang="ts">
	import TaskForm from "../components/TaskForm.svelte";
	import {
		createTask,
		selectedTask,
		selectedTaskId,
		patchTask,
		Task,
		addRootTask,
		tasksForToday,
		deleteTask,
	} from "../store/tasks";
	import { link } from "svelte-routing";
	import Button from "../components/library/Button.svelte";
	import { isTabletUp, matches } from "../store/mediaquery";
	import Modal from "../components/library/Modal.svelte";
	import { writable } from "svelte/store";
	import ActionRow from "../components/library/ActionRow.svelte";

	interface Action {
		label: string;
		callback: () => any;
	}

	export let actions: Action[] = [];

	const isNavigationOpen = writable<boolean>(matches("(min-width: 1021px)"));

	$: pageActions = [
		...actions,
		{
			label: "Add to inbox",
			callback: onClickAddNewTask,
		},
	];

	function onClickAddNewTask() {
		const newTask = createTask();
		addRootTask(newTask);
		$selectedTaskId = newTask.id;
	}

	function onSaveTask(newValue: Partial<Task>) {
		patchTask($selectedTask.id, newValue);
	}
</script>

<div class="page" class:is-navigation-open={$isNavigationOpen}>
	{#if $isNavigationOpen}
		<nav>
			<ul>
				<li>
					<a href="/" use:link>Inbox</a>
				</li>

				<li>
					<a href="/today" use:link>Today</a>
					{#if $tasksForToday.length > 0}
						&middot; {$tasksForToday.length}
					{/if}
				</li>

				<li>
					<a href="/someday" use:link>Someday</a>
				</li>

				<li>
					<a href="/logbook" use:link>Logbook</a>
				</li>
			</ul>
		</nav>
	{/if}

	<header>
		{#if $isNavigationOpen}
			<Button
				variant="text"
				on:click={() => {
					$isNavigationOpen = false;
				}}
				>Close menu
			</Button>
		{:else}
			<Button
				variant="text"
				on:click={() => {
					$isNavigationOpen = true;
				}}
				>Open menu
			</Button>
		{/if}

		<ActionRow actions={pageActions} />
	</header>

	<main>
		<slot />
	</main>

	{#if $selectedTask}
		{#if $isTabletUp}
			<aside>
				<TaskForm
					title={$selectedTask.title}
					notes={$selectedTask.notes}
					tags={$selectedTask.tags}
					status={$selectedTask.status}
					deferType={$selectedTask.deferType}
					deferredTo={$selectedTask.deferredTo}
					due={$selectedTask.due}
					on:save={({ detail: newValue }) => {
						onSaveTask(newValue);
					}}
					on:cancel={() => {
						$selectedTaskId = null;
					}}
					on:delete={() => {
						deleteTask($selectedTaskId);
					}}
				/>
			</aside>
		{:else}
			<Modal>
				<TaskForm
					title={$selectedTask.title}
					notes={$selectedTask.notes}
					tags={$selectedTask.tags}
					status={$selectedTask.status}
					deferType={$selectedTask.deferType}
					deferredTo={$selectedTask.deferredTo}
					due={$selectedTask.due}
					on:save={({ detail: newValue }) => {
						onSaveTask(newValue);
						$selectedTaskId = null;
					}}
					on:cancel={() => {
						$selectedTaskId = null;
					}}
					on:delete={() => {
						deleteTask($selectedTaskId);
					}}
				/>
			</Modal>
		{/if}
	{/if}
</div>

<style lang="scss">
	.page {
		display: grid;
		grid-template-columns: auto 1fr auto;
		grid-template-rows: calc(2 * var(--baseline)) 1fr;

		&.is-navigation-open {
			height: 100vh;
			overflow: hidden;
		}
	}

	nav {
		grid-column: 1 / 2;
		grid-row: 2 / -1;
		width: 100vw;
		padding: var(--baseline);

		@media (min-width: 641px) {
			width: 180px;
			border-right: 1px solid var(--border-color-ui-secondary);
		}
	}

	ul {
		list-style: none;
	}

	header {
		grid-column: 1 / -1;
		grid-row: 1 / 2;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 var(--baseline);
		border-bottom: 1px solid var(--border-color-ui-secondary);
	}

	main {
		grid-column: 2 / 3;
		grid-row: 2 / 3;
		padding: var(--baseline);
	}

	aside {
		grid-column: 3 / 4;
		grid-row: 2 / 3;

		width: 400px;
		padding: var(--baseline);
	}

	nav,
	aside {
		position: sticky;
		overflow: scroll;
		top: calc(1 * var(--baseline));
		height: calc(100vh - 1 * var(--baseline));
	}
</style>

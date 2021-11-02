<script lang="ts">
	import { createTask, rootTaskIds, tasks } from "../store/tasks";

	function onClickAddNewTask() {
		const newTask = createTask();

		$tasks = [...$tasks, newTask];
		$rootTaskIds = [...$rootTaskIds, newTask.id];
	}
</script>

<header>
	<button on:click={onClickAddNewTask}>Add new task to inbox</button>
</header>

<div>
	<slot />
</div>

<script lang="ts">
	import { Task } from "../store/tasks";
	import TaskItem from "./TaskItem.svelte";

	export let tasks: Task[];
</script>

<ul>
	{#each tasks as task}
		<li>
			<TaskItem {task} />
		</li>
	{/each}
</ul>

<style>
	ul {
		list-style: none;
	}
</style>

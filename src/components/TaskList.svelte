<script lang="ts">
	import { taskBeingEdited, taskWithFocus } from "../store/tasks";
	import TaskItem from "./TaskItem.svelte";
	import type { Task } from "../store/tasks";
	
	export let tasks: Task[] = [];
</script>

<ul class="TaskList">
	{#each tasks as task (task.id)}
		<li>
			<TaskItem
				task={task}
				hasFocus={$taskWithFocus === task}
				isEditing={$taskBeingEdited === task}
			/>
		</li>
	{/each}
</ul>

<style lang="scss">
	.TaskList {
		list-style: none;
	}
</style>

<script lang="ts">
	import { Task } from "../store/tasks";

	export let value: Task["status"] = "inProgress";

	const name = "task-status";
	const options = [
		{
			value: "inProgress",
			text: "In progress",
		},
		{
			value: "done",
			text: "Done",
		},
		{
			value: "dropped",
			text: "Dropped",
		},
	];
</script>

<div class="task-status-input">
	{#each options as option, index}
		<div class="option">
			<input
				bind:group={value}
				type="radio"
				{name}
				id={`${name}-${index}`}
				value={option.value}
			/>

			<label for={`${name}-${index}`}>{option.text}</label>
		</div>
	{/each}
</div>

<style lang="scss">
	.task-status-input {
		display: flex;
		width: 100%;
		justify-content: stretch;
	}

	.option {
		flex-basis: 100%;
		flex-grow: 1;
		height: var(--baseline);
		border-right: 1px solid var(--background-color-ui-inverse);
		border-top: 1px solid var(--background-color-ui-inverse);
		border-bottom: 1px solid var(--background-color-ui-inverse);

		&:first-child {
			border-left: 1px solid var(--background-color-ui-inverse);
			border-top-left-radius: 5px;
			border-bottom-left-radius: 5px;
		}

		&:last-child {
			border-top-right-radius: 5px;
			border-bottom-right-radius: 5px;
		}
	}

	input {
		display: none;
	}

	label {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;

		input:checked + & {
			background-color: var(--background-color-ui-inverse);
			color: var(--color-text-inverse);
		}
	}
</style>

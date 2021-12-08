<script lang="ts">
	import { Task } from "../store/tasks";
	import { getDateValueForEvent, getFormattedDate } from "../utilities/dates";

	export let deferType: Task["deferType"];
	export let deferredTo: Task["deferredTo"];

	const name = "task-defer-input";
	const options = [
		{
			text: "Don't defer",
			value: "none",
		},
		{
			text: "Specific date",
			value: "date",
		},
		{
			text: "Someday",
			value: "someday",
		},
	];

	function onChangeDeferredTo(event: any) {
		deferredTo = getDateValueForEvent(event);

		if (deferType === "date" && deferredTo === null) {
			deferType = "none";
		}

		if (deferType !== "date" && deferredTo !== null) {
			deferType = "date";
		}
	}
</script>

{#each options as option, index}
	<div>
		<input
			bind:group={deferType}
			type="radio"
			{name}
			id={`${name}-${index}`}
			value={option.value}
		/>

		<label for={`${name}-${index}`}>
			{#if option.value === "date"}
				<input
					type="date"
					value={getFormattedDate(deferredTo)}
					on:change={onChangeDeferredTo}
				/>
			{:else}
				{option.text}
			{/if}
		</label>
	</div>
{/each}

<style lang="scss">
	input {
		cursor: pointer;
	}

	label {
		cursor: pointer;
		line-height: var(--baseline);
	}
</style>

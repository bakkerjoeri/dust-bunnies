<script lang="ts">
	import FormItem from "./library/form/FormItem.svelte";
	import InputText from "./library/form/InputText.svelte";
	import Button from "./library/Button.svelte";
	import { createEventDispatcher } from "svelte";
	import TextArea from "./library/form/TextArea.svelte";
	import TagInput from "./TagInput.svelte";
	import type { Task } from "../store/tasks";
	import TaskStatusInput from "./TaskStatusInput.svelte";
	import { getDateValueForEvent, getFormattedDate } from "../utilities/dates";
	import TaskDeferInput from "./TaskDeferInput.svelte";

	export let title: string;
	export let notes: string;
	export let tags: string[];
	export let status: Task["status"];
	export let deferType: Task["deferType"];
	export let deferredTo: Task["deferredTo"];
	export let due: Task["due"];

	const dispatch = createEventDispatcher<{
		save: Partial<Task>;
		delete: undefined;
		cancel: undefined;
	}>();

	function save() {
		dispatch("save", {
			title,
			notes,
			tags,
			status,
			deferType,
			deferredTo,
			due,
		});
	}
</script>

<form on:submit|preventDefault={save}>
	<FormItem label="Title" let:id>
		<InputText type="text" bind:value={title} {id} />
	</FormItem>

	<FormItem label="Status">
		<TaskStatusInput bind:value={status} />
	</FormItem>

	<FormItem label="Notes" let:id>
		<TextArea bind:value={notes} {id} />
	</FormItem>

	<FormItem label="Tags" let:id>
		<TagInput {id} bind:tags />
	</FormItem>

	<FormItem label="Defer until">
		<TaskDeferInput bind:deferType bind:deferredTo />
	</FormItem>

	<FormItem label="Due" let:id>
		<input
			type="date"
			{id}
			value={getFormattedDate(due)}
			on:change={(event) => {
				due = getDateValueForEvent(event);
			}}
		/>
	</FormItem>

	<Button type="submit" variant="outline">Save</Button>
	<Button on:click={() => dispatch("cancel")} variant="outline">Cancel</Button
	>

	<Button on:click={() => dispatch("delete")} variant="outline" color="danger"
		>Delete</Button
	>
</form>

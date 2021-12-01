<script lang="ts">
	import FormItem from "./library/form/FormItem.svelte";
	import InputText from "./library/form/InputText.svelte";
	import Button from "./library/Button.svelte";
	import { createEventDispatcher } from "svelte";
	import TextArea from "./library/form/TextArea.svelte";
	import TagInput from "./TagInput.svelte";
	import type { Task } from "../store/tasks";
	import RadioGroup from "./library/form/RadioGroup.svelte";

	export let title: string;
	export let notes: string;
	export let tags: string[];
	export let status: Task["status"];
	export let deferType: Task["deferType"];
	export let deferredTo: Task["deferredTo"];

	const dispatch = createEventDispatcher<{ save: Partial<Task> }>();

	function save() {
		dispatch("save", {
			title,
			notes,
			tags,
			status,
			deferType,
			deferredTo,
		});
	}
</script>

<form on:submit|preventDefault={save}>
	<FormItem label="Title" let:id>
		<InputText type="text" bind:value={title} {id} />
	</FormItem>

	<FormItem label="Notes" let:id>
		<TextArea bind:value={notes} {id} />
	</FormItem>

	<FormItem label="Tags" let:id>
		<TagInput {id} bind:tags />
	</FormItem>

	<FormItem label="Status">
		<RadioGroup
			bind:value={status}
			options={[
				{
					text: "In progress",
					value: "inProgress",
				},
				{
					text: "Done",
					value: "done",
				},
				{
					text: "Dropped",
					value: "dropped",
				},
			]}
		/>
	</FormItem>

	<FormItem label="Defer">
		<RadioGroup
			bind:value={deferType}
			options={[
				{
					text: "Don't defer",
					value: "none",
				},
				{
					text: "Until date",
					value: "date",
				},
				{
					text: "Someday",
					value: "someday",
				},
			]}
		/>
	</FormItem>

	{#if deferType === "date"}
		<FormItem label="Defer date">
			<input type="date" bind:value={deferredTo} />
		</FormItem>
	{/if}

	<Button type="submit" variant="outline">Save</Button>
</form>

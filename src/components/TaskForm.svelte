<script lang="ts">
	import FormItem from "./library/form/FormItem.svelte";
	import InputText from "./library/form/InputText.svelte";
	import Button from "./library/Button.svelte";
	import { createEventDispatcher } from "svelte";
	import TextArea from "./library/form/TextArea.svelte";
	import TagInput from "./TagInput.svelte";
	import type { Task } from "../store/tasks";
	import RadioGroup from "./library/form/RadioGroup.svelte";
	import dayjs, { unix } from "dayjs";

	export let title: string;
	export let notes: string;
	export let tags: string[];
	export let status: Task["status"];
	export let deferType: Task["deferType"];
	export let deferredTo: Task["deferredTo"];
	export let due: Task["due"];
	export let isInTrash = false;

	const dispatch =
		createEventDispatcher<{
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

	function getFormattedDate(unixDate: number): string {
		return dayjs(unixDate).format("YYYY-MM-DD");
	}

	function getUnixDate(dateString: string): number {
		return dayjs(dateString).valueOf();
	}

	function getDateValueForEvent(event: any) {
		if (!event.target.value) {
			return null;
		}

		return getUnixDate(event.target.value);
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

	<FormItem label="Defer until">
		<RadioGroup
			bind:value={deferType}
			options={[
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
			]}
		/>
	</FormItem>

	{#if deferType === "date"}
		<FormItem label="Defer date" let:id>
			<input
				type="date"
				{id}
				value={getFormattedDate(deferredTo)}
				on:change={(event) => {
					deferredTo = getDateValueForEvent(event);
				}}
			/>
		</FormItem>
	{/if}

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

	{#if !isInTrash}
		<Button
			on:click={() => dispatch("delete")}
			variant="outline"
			color="danger">Move to trash</Button
		>
	{/if}
</form>

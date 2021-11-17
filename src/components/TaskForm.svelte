<script lang="ts">
	import FormItem from "./library/form/FormItem.svelte";
	import InputText from "./library/form/InputText.svelte";
	import Button from "./library/Button.svelte";
	import { createEventDispatcher } from "svelte";
	import TextArea from "./library/form/TextArea.svelte";
	import type { Task } from "../store/tasks";

	export let title: string;

	const dispatch = createEventDispatcher<{ save: Partial<Task> }>();

	function save() {
		dispatch("save", {
			title,
		});
	}
</script>

<form on:submit|preventDefault={save}>
	<FormItem label="Title" let:id>
		<InputText type="text" bind:value={title} {id} />
	</FormItem>

	<Button type="submit" variant="outline">Save</Button>
</form>

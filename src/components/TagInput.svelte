<script lang="ts">
	import InputText from "./library/form/InputText.svelte";

	export let id = "";
	export let tags: string[] = [];

	$: tagString = tags.join(" ");

	function handleInput(event: any) {
		tags = transformTagstringIntoTags(event.target.value);
	}

	function transformTagstringIntoTags(tagString: string): string[] {
		const trimmedTagString = tagString.trim();
		if (!trimmedTagString) {
			return [];
		}
		return trimmedTagString.split(" ");
	}
</script>

<InputText
	type="text"
	{id}
	value={tagString}
	on:input={handleInput}
	autocomplete="off"
	autocapitalize="off"
/>

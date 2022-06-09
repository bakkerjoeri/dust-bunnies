<script lang="ts">
	import uuid from "@bakkerjoeri/uuid";

	export let checked: boolean;
	export let label: string;
	export let id: string = uuid();
</script>

<div>
	<input bind:checked type="checkbox" {id} />

	<label for={id}>
		{label}
	</label>
</div>

<style lang="scss">
	label {
		line-height: var(--baseline);
	}
</style>

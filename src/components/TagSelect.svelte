<script lang="ts">
	import VisuallyHidden from "./library/VisuallyHidden.svelte";

	export let tags: string[];
	export let selected: string;

	$: options = [
		{ text: "All", value: null },
		...tags.map((tag) => {
			return { text: tag, value: tag };
		}),
	];
</script>

<ul>
	{#each options as { value, text } (value)}
		<li class="tag" class:is-selected={value === selected}>
			<VisuallyHidden>
				<input
					type="radio"
					id={`tag-picker-option-${value}`}
					bind:group={selected}
					{value}
				/>
			</VisuallyHidden>
			<label for={`tag-picker-option-${value}`}>
				{text}
			</label>
		</li>
	{/each}
</ul>

<style lang="scss">
	ul {
		display: flex;
		list-style: none;
	}

	li + li {
		margin-left: 10px;
	}

	.tag {
		display: flex;
		align-items: center;
		height: var(--baseline);
		padding: 0 10px;
		background-color: var(--background-color-ui-primary);
		border: 1px solid var(--background-color-ui-primary);
		border-radius: 20px;
		transition: background-color 0.2s, color 0.2s, border-color 0.2s;

		&.is-selected {
			background-color: var(--background-color-ui-inverse);
			color: var(--color-text-inverse);
			border: 1px solid var(--background-color-ui-inverse);
		}

		&:hover:not(.is-selected),
		&:focus-within:not(.is-selected) {
			background-color: var(--border-color-ui-secondary);
			border-color: var(--border-color-ui-secondary);
		}
	}
</style>

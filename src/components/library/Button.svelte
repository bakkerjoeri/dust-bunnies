<script lang="ts">
	export let disabled: boolean = false;
	export let type: "button" | "submit" = "button";
	export let variant: "outline" | "text" = "outline";
	export let size: "normal" | "small" = "normal";
	export let color: "normal" | "danger" = "normal";
</script>

<button
	{...$$props}
	on:click
	{type}
	{disabled}
	class:variant-outline={variant === "outline"}
	class:variant-text={variant === "text"}
	class:size-normal={size === "normal"}
	class:size-small={size === "small"}
	class:color-normal={color === "normal"}
	class:color-danger={color === "danger"}
>
	<slot />
</button>

<style lang="scss">
	button {
		display: inline-block;
		line-height: var(--baseline);
		white-space: nowrap;
		border: 0;
		background-color: transparent;
		color: var(--color-text);
	}

	.variant-outline {
		padding: 0 10px;
		border-radius: 5px;
		line-height: calc(var(--baseline) - 2px);
		border: 1px solid var(--border-color-ui-primary);
	}

	.variant-text {
		&:hover,
		&:focus {
			text-decoration: underline;
		}
	}

	.size-normal {
		font-size: 16px;
	}

	.size-small {
		font-size: 14px;
	}

	.color-danger {
		color: #ffffff;
		background-color: #c60101;
		border-color: #c60101;
	}
</style>

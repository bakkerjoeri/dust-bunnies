<script lang="ts">
	import dayjs from "dayjs";
	import { time } from "./../store/time";

	export let due: number;

	$: isDue = dayjs(due).isToday() || dayjs(due).diff(dayjs(), "day") <= 0;
	$: label = (() => {
		const now = dayjs($time);
		const then = dayjs(due);
		const differenceInYears = then.diff(now, "year");

		if (differenceInYears > 0) {
			return `in ${differenceInYears} ${
				differenceInYears === 1 ? "year" : "years"
			}`;
		}

		const differenceInMonths = then.diff(now, "month");

		if (differenceInMonths > 0) {
			return `in ${differenceInMonths} ${
				differenceInMonths === 1 ? "month" : "months"
			}`;
		}

		const differenceInWeeks = then.diff(now, "week");

		if (differenceInWeeks > 0) {
			return `in ${differenceInWeeks} ${
				differenceInWeeks === 1 ? "week" : "weeks"
			}`;
		}

		if (then.isTomorrow()) {
			return "tomorrow";
		}

		if (then.isToday()) {
			return "today";
		}

		const differenceInDays = then.diff(now, "day");

		if (differenceInDays <= 0) {
			return "overdue";
		}

		return `in ${differenceInDays} ${
			differenceInDays === 1 ? "day" : "days"
		}`;
	})();
</script>

<span class="due" class:is-due={isDue}>
	{#if isDue}
		🚩
	{/if}
	{label}
</span>

<style lang="scss">
	span {
		font-size: var(--font-size-small);
		line-height: var(--baseline);
		color: var(--color-text-soft);

		&.is-due {
			color: hsla(350, 100%, 43%, 0.8);
			font-weight: bold;
		}
	}
</style>

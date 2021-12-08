import dayjs from "dayjs";

export function when(date: number): string {
	const now = dayjs();
	const then = dayjs(date);

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
	return `in ${differenceInDays} ${differenceInDays === 1 ? "day" : "days"}`;
}

export function getFormattedDate(unixDate: number): string {
	return dayjs(unixDate).format("YYYY-MM-DD");
}

export function getUnixDate(dateString: string): number {
	return dayjs(dateString).valueOf();
}

export function getDateValueForEvent(event: any) {
	if (!event.target.value) {
		return null;
	}

	return getUnixDate(event.target.value);
}

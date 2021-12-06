import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";

dayjs.extend(isToday);
dayjs.extend(isTomorrow);

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

import dayjs from "dayjs";

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

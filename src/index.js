import App from "./App.svelte";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";

dayjs.extend(isSameOrBefore);
dayjs.extend(isToday);
dayjs.extend(isTomorrow);

new App({
	target: document.body,
});

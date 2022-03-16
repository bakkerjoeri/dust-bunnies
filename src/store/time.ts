import { readable } from "svelte/store";

export const time = readable<number>(new Date().valueOf(), (set) => {
	const interval = setInterval(() => {
		set(new Date().valueOf());
	}, 1000);

	return () => {
		clearInterval(interval);
	}
});

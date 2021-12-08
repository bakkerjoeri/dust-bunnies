import { writable } from "svelte/store";
import { matches } from "./mediaquery";

export const isNavigationOpen = writable<boolean>(
	matches("(min-width: 1021px)")
);

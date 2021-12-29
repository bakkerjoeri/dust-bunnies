import { writable, get } from "svelte/store";
import type { Writable } from "svelte/store";

export function localStore<TValue>(
	key: string,
	store = writable<TValue>()
): Writable<TValue> {
	if (localStorage.getItem(key) !== null && isValidJSON(localStorage.getItem(key))) {
		const savedValue = JSON.parse(localStorage.getItem(key));
		store.set(savedValue);
	} else if (get(store) !== undefined) {
		const initialValue = get(store);
		localStorage.setItem(key, JSON.stringify(initialValue));
	}

	const { set } = store;

	return {
		...store,
		set: (value: TValue) => {
			save(key, value);
			set(value);
		},
		update: (updater: (value: TValue) => TValue) => {
			const value = updater(get(store));
			save(key, value);
			set(value);
		},
	};
}

function save(key: string, value: any): void {
	if (typeof localStorage === "undefined") {
		return;
	}

	localStorage.setItem(key, JSON.stringify(value));
}

function isValidJSON(value: string) {
	try {
		JSON.parse(value);
	} catch (e) {
		return false;
	}

	return true;
}

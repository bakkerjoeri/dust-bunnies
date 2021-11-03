import uuid from "@bakkerjoeri/uuid";
import { derived, writable } from "svelte/store";
import { collectionStore } from "./collectionStore";
import { localStore } from "./localStore";
import type { Readable } from "svelte/store";

export interface Task {
	id: string;
	title: string;
	notes: string;
	subtaskIds: Task["id"][];
	status: "inProgress" | "done" | "dropped";
	deferType: "none" | "date" | "someday";
	deferredTo: null | number;
	due: null | number;
	createdAt: number;
	doneAt: null | number;
	droppedAt: null | number;
}

export function createTask(value: Partial<Task> = {}): Task {
	return {
		id: uuid(),
		title: "",
		notes: "",
		subtaskIds: [],
		status: "inProgress",
		deferType: "none",
		deferredTo: null,
		due: null,
		createdAt: Date.now().valueOf(),
		doneAt: null,
		droppedAt: null,
		...value,
	};
}

export const tasks = collectionStore(localStore<Task[]>("tasks", writable([])));
export const rootTaskIds = localStore<Task["id"][]>(
	"rootTaskIds",
	writable([])
);
export const rootTasks = derived(
	[rootTaskIds, tasks],
	([rootTaskIds, tasks]) => {
		return rootTaskIds.map((id) => tasks.find((task) => task.id === id));
	}
);

export const selectedTaskId = writable<Task["id"] | null>(null);
export const selectedTask: Readable<Task | null> = derived(
	[selectedTaskId, tasks],
	([selectedTaskId, tasks]) => {
		if (!selectedTaskId) {
			return null;
		}

		return tasks.find((task) => task.id === selectedTaskId);
	}
);

export const inbox = derived([rootTasks], ([rootTasks]) => {
	return rootTasks.filter((task) => {
		const isTaskInProgress = task.status === "inProgress";
		const isTaskUndeferred =
			task.deferType === "none" ||
			(task.deferType === "date" && task.deferredTo === null);

		return isTaskInProgress && isTaskUndeferred;
	});
});

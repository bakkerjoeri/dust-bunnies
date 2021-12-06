import uuid from "@bakkerjoeri/uuid";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { derived, get, writable } from "svelte/store";
import { collectionStore } from "./collectionStore";
import { localStore } from "./localStore";
import type { Readable } from "svelte/store";

dayjs.extend(isSameOrBefore);

export interface Task {
	id: string;
	title: string;
	notes: string;
	tags: string[];
	subtaskIds: Task["id"][];
	status: "inProgress" | "done" | "dropped";
	deferType: "none" | "date" | "someday";
	deferredTo: null | number;
	due: null | number;
	createdAt: number;
	updatedAt: null | number;
	doneAt: null | number;
	droppedAt: null | number;
	isInTrash: boolean;
}

export function createTask(value: Partial<Task> = {}): Task {
	return {
		id: uuid(),
		title: "",
		notes: "",
		tags: [],
		subtaskIds: [],
		status: "inProgress",
		deferType: "none",
		deferredTo: null,
		due: null,
		createdAt: Date.now().valueOf(),
		updatedAt: null,
		doneAt: null,
		droppedAt: null,
		isInTrash: false,
		...value,
	};
}

export const tasks = collectionStore(localStore<Task[]>("tasks", writable([])));

export function findTask(taskId: Task["id"]): Task {
	const task = get(tasks).find((task) => task.id === taskId);

	if (!task) {
		throw new Error(`No task with ID ${taskId} exists.`);
	}

	return task;
}

export function updateTask(
	taskId: Task["id"],
	updater: (task: Task) => Task
): void {
	const oldValue = findTask(taskId);
	const newValue = updater(oldValue);

	newValue.updatedAt = new Date().valueOf();

	if (oldValue.status !== "done" && newValue.status === "done") {
		newValue.doneAt = new Date().valueOf();
	}

	if (newValue.status !== "done") {
		newValue.doneAt = null;
	}

	if (oldValue.status !== "dropped" && newValue.status === "dropped") {
		newValue.droppedAt = new Date().valueOf();
	}

	if (newValue.status !== "dropped") {
		newValue.droppedAt = null;
	}

	tasks.patch(taskId, newValue);
}

export function patchTask(taskId: Task["id"], newValue: Partial<Task>) {
	updateTask(taskId, (task) => {
		return {
			...task,
			...newValue,
		};
	});
}

export function addRootTask(task: Task) {
	tasks.add(task);

	rootTaskIds.update((rootTaskIds) => {
		return [...rootTaskIds, task.id];
	});
}

export function addSubtask(parentTaskId: Task["id"], subtaskId: Task["id"]) {
	updateTask(parentTaskId, (task) => {
		return {
			...task,
			subtaskIds: [...task.subtaskIds, subtaskId],
		};
	});
}

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
export const activeTasks = derived([rootTasks], ([rootTasks]) => {
	return rootTasks.filter((task) => !task.isInTrash);
});

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

export const inbox = derived([activeTasks], ([activeTasks]) => {
	return activeTasks.filter((task) => {
		const isTaskInProgress = task.status === "inProgress";
		const isTaskUndeferred =
			task.deferType === "none" ||
			(task.deferType === "date" && task.deferredTo === null);

		return !task.isInTrash && isTaskInProgress && isTaskUndeferred;
	});
});

export const tasksForToday = derived([activeTasks], ([activeTasks]) => {
	return activeTasks.filter((task) => {
		const isTaskInProgress = task.status === "inProgress";
		const isTaskDeferredToToday =
			task.deferType === "date" &&
			task.deferredTo !== null &&
			dayjs(task.deferredTo).isSameOrBefore(dayjs(new Date(), "day"));

		const isTaskDueToday =
			task.due !== null &&
			dayjs(task.due).isSameOrBefore(dayjs(new Date(), "day"));

		return isTaskInProgress && (isTaskDeferredToToday || isTaskDueToday);
	});
});

export const tasksForSomeday = derived([activeTasks], ([activeTasks]) => {
	return activeTasks.filter((task) => task.deferType === "someday");
});

export const tasksInLogbook = derived([activeTasks], ([activeTasks]) => {
	return activeTasks.filter((task) => {
		return task.status === "done" || task.status === "dropped";
	});
});

export const tasksInTrash = derived([rootTasks], ([rootTasks]) => {
	return rootTasks.filter((task) => task.isInTrash);
});

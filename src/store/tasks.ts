import uuid from "@bakkerjoeri/uuid";
import dayjs from "dayjs";
import { derived, get, writable } from "svelte/store";
import { collectionStore } from "./collectionStore";
import { localStore } from "./localStore";
import type { Readable } from "svelte/store";
import { database } from "./../utilities/firebase";
import { firestoreUserCollection} from "./firestore";

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
		...value,
	};
}

function createTaskStore() {
	const local = localStore<Task[]>("tasks", writable([]));
	const remote = firestoreUserCollection<Task>(
		database,
		"tasks",
		local
	);
	const collection = collectionStore<Task>(remote);

	return collection;
}
export const tasks = createTaskStore();

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

export function addTask(task: Task) {
	tasks.add(task);
}

export function addSubtask(parentTaskId: Task["id"], subtaskId: Task["id"]) {
	updateTask(parentTaskId, (task) => {
		return {
			...task,
			subtaskIds: [...task.subtaskIds, subtaskId],
		};
	});
}

export function deleteTask(taskId: Task["id"]) {
	tasks.update((tasks) => {
		// Remove from subtaskIds
		return tasks
			.filter((task) => {
				return task.id !== taskId;
			})
			.map((task) => {
				return {
					...task,
					subtaskIds: task.subtaskIds.filter(
						(subtaskId) => subtaskId !== taskId
					),
				};
			});
	});

	// Remove from selectedTaskId
	if (get(selectedTaskId) === taskId) {
		selectedTaskId.set(null);
	}
}

export const rootTasks = derived(
	[tasks],
	([tasks]) => {
		const allSubtaskIds = tasks.reduce((allSubtaskIds, task) => {
			return [...allSubtaskIds, ...task.subtaskIds];
		}, []);

		const tasksWithoutParent = tasks.filter((task) => {
			return !allSubtaskIds.includes(task.id);
		});

		return tasksWithoutParent; 
	}
);

export const activeTasks = derived([rootTasks], ([rootTasks]) => {
	return [...rootTasks];
});

export const inProgressTasks = derived([activeTasks], ([activeTasks]) => {
	return activeTasks.filter((task) => {
		return task.status === "inProgress";
	});
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
		const isTaskWithoutDueDate = task.due === null;

		return isTaskInProgress && isTaskUndeferred && isTaskWithoutDueDate;
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

export const tasksForSomeday = derived([inProgressTasks], ([inProgressTasks]) => {
	return inProgressTasks.filter((task) => task.deferType === "someday");
});

export const tasksInLogbook = derived([activeTasks], ([activeTasks]) => {
	return activeTasks.filter((task) => {
		return task.status === "done" || task.status === "dropped";
	});
});


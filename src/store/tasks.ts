import { writable, derived, get } from 'svelte/store';
import uuid from '../utilities/uuid';
import { createLocalStore } from './localStore';

type DisplayMode = 'all' | 'remaining' | 'available' | 'nextUp';

export interface Task {
	id: string,
	title: string;
	isDone: boolean;
	subTasks: Task[]
}

export function createEmptyTask(): Task {
	return {
		id: uuid(),
		title: '',
		isDone: false,
		subTasks: [],
	};
}

let mockTasks: Task[] = [
	{
		id: '1',
		title: 'My first task',
		isDone: false,
		subTasks: [],
	},
	{
		id: '2',
		title: 'My second task',
		isDone: false,
		subTasks: [
			{
				id: '3',
				title: 'Here is a subtask',
				isDone: false,
				subTasks: [],
			},
			{
				id: '4',
				title: 'And another',
				isDone: false,
				subTasks: [],
			}
		],
	}
];

function createTaskStore() {
	const { subscribe, set, update } = createLocalStore<Task[]>('tasks', []);
	// const { subscribe, set, update } = writable(mockTasks);

	return {
		subscribe,
		set,
		update,
		patch(id: Task['id'], newData: Partial<Task>): void {
			update(tasks => {
				return tasks.map(task => {
					if (task.id === id) {
						return { ...task, ...newData };
					}
	
					return task;
				});
			});
		},
		addTask: (task: Task): void => {
			update(tasks => {
				return [
					...tasks,
					task,
				];
			});
		},
		insertTask: (task: Task, index: number): void => {
			update(tasks => {
				return [
					...tasks.slice(0, index),
					task,
					...tasks.slice(index),
				]
			});
		},
		deleteTask: (id: Task['id']): void => {
			update(tasks => tasks.filter(task => task.id !== id));
		}
	}
}

export const tasks = createTaskStore();
export const taskWithFocus = writable<Task | null>(null);
export const taskBeingEdited = writable<Task | null>(null);
export const displayMode = writable<DisplayMode>('all');
export const visibleTasks = derived(
	[tasks, displayMode],
	([$tasks, $displayMode]) => $tasks.filter(task => isTaskVisible(task, $displayMode))
);

function isTaskVisible(task: Task, displayMode: DisplayMode) {
	if (displayMode === 'remaining') {
		return !task.isDone;
	}

	return true;
}

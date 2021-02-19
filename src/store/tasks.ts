import uuid from '../utilities/uuid';
import { createLocalStore } from './localStore';

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

function createTaskStore() {
	const { subscribe, set, update } = createLocalStore<Task[]>('tasks', []);

	return {
		subscribe,
		set,
		update,
		deleteTask: (id: Task['id']): void => {
			update(tasks => tasks.filter(task => task.id !== id));
		}
	}
}

export const tasks = createTaskStore();

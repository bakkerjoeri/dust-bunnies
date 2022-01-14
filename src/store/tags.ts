import type { Task } from "./tasks";

type TagCount = Array<{
	tagName: string;
	count: number;
}>;

export function getTagCountForTasks(tasks: Task[]): TagCount {
	let tagCount: TagCount = [];

	tasks.forEach((task) => {
		task.tags.forEach((tag) => {
			const tagCountItem = tagCount.find((item) => item.tagName === tag);

			if (tagCountItem) {
				tagCountItem.count += 1;
			} else {
				tagCount = [...tagCount, { tagName: tag, count: 1 }];
			}
		});
	});

	return tagCount;
}

export function getTagsSortedByCount(tasks: Task[]): string[] {
	const tagCount = getTagCountForTasks(tasks);
	const sortedTagCount = [...tagCount].sort((a, b) => {
		if (a.count > b.count) {
			return -1;
		}

		if (a.count < b.count) {
			return 1;
		}

		if (a.tagName > b.tagName) {
			return 1;
		}

		if (a.tagName < b.tagName) {
			return -1;
		}

		return 0;
	});

	return sortedTagCount.map((item) => item.tagName);
}

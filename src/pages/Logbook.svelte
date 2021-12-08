<script lang="ts">
	import dayjs from "dayjs";

	import TaskList from "../components/TaskList.svelte";
	import Page from "../layouts/Page.svelte";
	import { Task, tasksInLogbook } from "../store/tasks";

	$: groupedTasks = groupTasksByDate($tasksInLogbook).sort(
		(entryA, entryB) => {
			if (dayjs(entryA.datestring).isAfter(entryB.datestring)) {
				return -1;
			}

			if (dayjs(entryA.datestring).isBefore(entryB.datestring)) {
				return 1;
			}

			return 0;
		}
	);

	function groupTasksByDate(
		tasks: Task[]
	): Array<{ datestring: string; tasks: Task[] }> {
		return tasks.reduce((result, task) => {
			if (task.doneAt === null && task.droppedAt === null) {
				return result;
			}

			const date = task.droppedAt ? task.droppedAt : task.doneAt;
			const datestring = dayjs(date).format("YYYY-MM-DD");

			if (result.some((entry) => entry.datestring === datestring)) {
				return result.map((entry) => {
					if (entry.datestring !== datestring) {
						return entry;
					}

					return {
						...entry,
						tasks: [task, ...entry.tasks],
					};
				});
			}

			return [
				...result,
				{
					datestring,
					tasks: [task],
				},
			];
		}, []);
	}

	function getDateHeader(date: number | string): string {
		const now = dayjs();
		const then = dayjs(date);

		if (then.isToday()) {
			return then.format("D [Today]");
		}

		if (then.isSame(now.add(-1, "day"))) {
			return then.format("D [Yesterday]");
		}

		if (then.isSame(now, "month")) {
			return then.format("D dddd");
		}

		if (then.isSame(now, "year")) {
			return then.format("D MMMM");
		}

		return then.format("D MMMM YYYY");
	}
</script>

<Page>
	<h1>Logbook</h1>

	{#each groupedTasks as entry}
		<h2>
			{getDateHeader(entry.datestring)}
		</h2>

		<TaskList tasks={entry.tasks} />
	{/each}
</Page>

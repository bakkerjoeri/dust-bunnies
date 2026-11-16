<script lang="ts">
	import dayjs from 'dayjs';
	import TaskList from '../../components/TaskList.svelte';
	import TagSelect from '../../components/TagSelect.svelte';
	import Page from '../../layouts/Page.svelte';
	import type { Task } from '../../store/tasks';
	import { inProgressTasks, isTaskForToday } from '../../store/tasks';
	import { getTagsSortedByCount } from '../../store/tags';
	import { time } from '../../store/time';

	$: upcomingTasks = $inProgressTasks.filter((task) => {
		if (task.due === null && (task.deferType !== 'date' || task.deferredTo === null)) {
			return false;
		}

		return true;
	});

	let filteringByTag = '';
	$: tagsOfTasks = getTagsSortedByCount(upcomingTasks);
	$: filteredTasks = upcomingTasks.filter((task) => {
		if (filteringByTag === '') {
			return task;
		}

		return task.tags.some((tag) => {
			return filteringByTag === tag;
		});
	});

	$: groupedTasks = groupTasksByDate(filteredTasks).sort((entryA, entryB) => {
		if (dayjs(entryA.datestring).isAfter(entryB.datestring)) {
			return 1;
		}

		if (dayjs(entryA.datestring).isBefore(entryB.datestring)) {
			return -1;
		}

		return 0;
	});

	export function groupTasksByDate(tasks: Task[]): Array<{ datestring: string; tasks: Task[] }> {
		return tasks.reduce(
			(result, task) => {
				if (task.due === null && (task.deferType !== 'date' || task.deferredTo === null)) {
					return result;
				}

				const date = (() => {
					if (isTaskForToday(task, $time)) {
						return new Date().valueOf();
					}

					return task.deferType === 'date' && task.deferredTo ? task.deferredTo : task.due;
				})();

				const datestring = dayjs(date).format('YYYY-MM-DD');

				if (result.some((entry) => entry.datestring === datestring)) {
					return result.map((entry) => {
						if (entry.datestring !== datestring) {
							return entry;
						}

						return {
							...entry,
							tasks: [...entry.tasks, task]
						};
					});
				}

				return [
					...result,
					{
						datestring,
						tasks: [task]
					}
				];
			},
			[] as Array<{ datestring: string; tasks: Task[] }>
		);
	}

	function getDateHeader(date: number | string): string {
		const now = dayjs();
		const then = dayjs(date);

		if (then.isToday()) {
			return then.format('D [Today]');
		}

		if (then.isTomorrow()) {
			return then.format('D [Tomorrow]');
		}

		if (then.isSame(now, 'month')) {
			return then.format('D dddd');
		}

		if (then.isSame(now, 'year')) {
			return then.format('D MMMM');
		}

		return then.format('D MMMM YYYY');
	}
</script>

<Page>
	<h1>Upcoming</h1>

	{#if tagsOfTasks.length || filteringByTag}
		<TagSelect tags={tagsOfTasks} bind:selected={filteringByTag} />
	{/if}

	{#each groupedTasks as entry (entry.datestring)}
		<h2>
			{getDateHeader(entry.datestring)}
		</h2>

		<TaskList tasks={entry.tasks} />
	{:else}
		<p>No upcoming tasks!</p>
	{/each}
</Page>

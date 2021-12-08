<script>
	import { tasksForToday } from "../store/tasks";
	import NavigationItem from "./NavigationItem.svelte";
</script>

<nav>
	<ul>
		<NavigationItem on:navigate to="/">Inbox</NavigationItem>
		<NavigationItem
			on:navigate
			to="/today"
			count={$tasksForToday.length > 0
				? $tasksForToday.length
				: undefined}
		>
			Today
		</NavigationItem>
		<NavigationItem on:navigate to="/upcoming">Upcoming</NavigationItem>
		<NavigationItem on:navigate to="/someday">Someday</NavigationItem>
		<NavigationItem on:navigate to="/logbook">Logbook</NavigationItem>
	</ul>
</nav>

<style lang="scss">
	ul {
		list-style: none;
	}
</style>

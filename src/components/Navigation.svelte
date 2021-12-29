<script>
	import { isLoggedIn, logout } from "./../store/session";
import { tasksForToday } from "../store/tasks";
	import NavigationItem from "./NavigationItem.svelte";
import Button from "./library/Button.svelte";
</script>

<nav>
	<ul>
		<NavigationItem on:navigate to="/inbox">Inbox</NavigationItem>
		<NavigationItem
			to="/"
			on:navigate
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

	{#if !$isLoggedIn}
		<ul>
			<NavigationItem on:navigate to="/login">Log in</NavigationItem>
			<NavigationItem on:navigate to="/signup">Sign up</NavigationItem>
		</ul>
	{:else}
		<ul>
			<Button on:click={logout}>Log out</Button>
		</ul>
	{/if}
</nav>

<style lang="scss">
	ul {
		list-style: none;
	}

	ul + ul {
		margin-top: var(--baseline);
	}
</style>

<script lang="ts">
	import { Router, Route } from "svelte-routing";
	import Inbox from "./pages/Inbox.svelte";
	import Today from "./pages/Today.svelte";
	import Someday from "./pages/Someday.svelte";
	import Logbook from "./pages/Logbook.svelte";
	import Upcoming from "./pages/Upcoming.svelte";
</script>

<Router>
	<Route path="/">
		<Inbox />
	</Route>

	<Route path="/today">
		<Today />
	</Route>

	<Route path="/upcoming">
		<Upcoming />
	</Route>

	<Route path="/someday">
		<Someday />
	</Route>

	<Route path="/logbook">
		<Logbook />
	</Route>
</Router>

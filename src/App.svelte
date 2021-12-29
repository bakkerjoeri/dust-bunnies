<script lang="ts">
	import { Router, Route } from "svelte-routing";
	import Signup from "./pages/Signup.svelte";
	import Login from "./pages/Login.svelte";
	import Inbox from "./pages/Inbox.svelte";
	import Today from "./pages/Today.svelte";
	import Someday from "./pages/Someday.svelte";
	import Logbook from "./pages/Logbook.svelte";
	import Upcoming from "./pages/Upcoming.svelte";
</script>

<Router>
	<Route path="/signup">
		<Signup />
	</Route>

	<Route path="/login">
		<Login />
	</Route>

	<Route path="/inbox">
		<Inbox />
	</Route>

	<Route path="/">
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

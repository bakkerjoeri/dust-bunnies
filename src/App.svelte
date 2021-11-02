<script lang="ts">
	import { Router, Route } from "svelte-routing";
	import Inbox from "./pages/Inbox.svelte";
</script>

<Router>
	<Route path="/">
		<Inbox />
	</Route>
</Router>

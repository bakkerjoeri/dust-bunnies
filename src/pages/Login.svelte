<script lang="ts">
	import { auth } from "./../utilities/firebase";
	import { link, navigate } from "svelte-routing";
	import FormItem from "./../components/library/form/FormItem.svelte";
	import InputPassword from "./../components/library/form/InputPassword.svelte";
	import InputText from "./../components/library/form/InputText.svelte";
	import Button from "./../components/library/Button.svelte";
	import Page from "./../layouts/Page.svelte";
	import { signInWithEmailAndPassword } from "@firebase/auth";

	let emailAddress: string = "";
	let password: string = "";
	let isSubmitPending: boolean = false;
	let errors = [];

	async function handleSubmit() {
		isSubmitPending = true;
		errors = [];

		try {
			await signInWithEmailAndPassword(auth, emailAddress, password);
			navigate("/");
		} catch (error) {
			if (error.code === "auth/invalid-email") {
				errors.push({
					field: "email",
					message: "The email address you provided is not valid.",
				});
			} else if (error.code === "auth/user-disabled") {
				errors.push({
					field: "email",
					message:
						"The user this email address belongs to has been disabled.",
				});
			} else if (error.code === "auth/user-not-found") {
				errors.push({
					field: "email",
					message:
						"No user exists for the email address you provided.",
				});
			} else if (error.code === "auth/wrong-password") {
				errors.push({
					field: "password",
					message: "The password is incorrect.",
				});
			} else {
				errors.push({
					isForForm: true,
					message: "Something went wrong. Please try again.",
				});

				throw error;
			}

			isSubmitPending = false;
		}
	}
</script>

<Page>
	<h1>Log in</h1>

	<form on:submit|preventDefault={handleSubmit}>
		<FormItem label="Email address" labelFor="loginEmailAddress">
			<InputText
				type="email"
				bind:value={emailAddress}
				id="loginEmailAddress"
				autocomplete="username"
				required
				disabled={isSubmitPending}
			/>
		</FormItem>

		<FormItem label="Password" labelFor="loginPassword">
			<InputPassword
				bind:value={password}
				id="loginPassword"
				autocomplete="current-password"
				required
				disabled={isSubmitPending}
			/>
		</FormItem>

		<FormItem>
			<Button type="submit" disabled={isSubmitPending}>Log in</Button>
		</FormItem>
	</form>

	<p>
		If you do not have an account yet, you can <a href="/signup" use:link
			>sign up</a
		> for one.
	</p>
</Page>

<style lang="scss">
	form {
		margin-bottom: var(--baseline);
	}
</style>

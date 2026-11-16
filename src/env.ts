import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	SNOWPACK_PUBLIC_FIREBASE_API_KEY: { public: true },
	SNOWPACK_PUBLIC_FIREBASE_AUTH_DOMAIN: { public: true },
	SNOWPACK_PUBLIC_FIREBASE_PROJECT_ID: { public: true },
	SNOWPACK_PUBLIC_FIREBASE_STORAGE_BUCKET: { public: true },
	SNOWPACK_PUBLIC_FIREBASE_MESSAGE_SENDER_ID: { public: true },
	SNOWPACK_PUBLIC_FIREBASE_APP_ID: { public: true }
});

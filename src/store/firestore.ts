import { get, writable } from "svelte/store";
import { isEqual } from "lodash-es";
import {
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	setDoc,
	updateDoc,
	getDocs,
} from "firebase/firestore";
import {
	loggedInState,
	loggedInUserId,
	previousLoggedInState,
} from "./session";
import { compare } from "./../utilities/sorting";
import type { Writable } from "svelte/store";
import type {
	CollectionReference,
	DocumentData,
	Firestore,
} from "firebase/firestore";

interface ObjectWithId {
	id: string;
	[key: string]: any;
}

/**
 * A svelte store that's connected to a firestore collection. This store will be able to fetch & persist data with firestore once the user is logged in. While logged out, the data is only committed to the base store.
 * @param path The path relative to `users/:userId/` where the collection is found. Make sure you omit any leading `/`.
 * @param store The base svelte store that is synced to firestore. If you don't provide one, the function will init its own.
 */
export function firestoreUserCollection<Item extends ObjectWithId>(
	database: Firestore,
	path: string,
	store = writable<Item[]>([])
): Writable<Item[]> {
	const initial = get(store);
	let currentLocalValue = initial;
	let cleanup = null;

	loggedInState.subscribe(async (state) => {
		const previousState = get(previousLoggedInState);
		const authLoadedIntoLoggedIn =
			state === "loggedIn" && previousState === "loading";
		const userLoggedIn =
			state === "loggedIn" && previousState === "loggedOut";
		const userLoggedOut =
			state === "loggedOut" && previousState === "loggedIn";

		if (authLoadedIntoLoggedIn || userLoggedIn) {
			const reference = collection(
				database,
				`users/${get(loggedInUserId)}/${path}`
			);

			if (userLoggedIn) {
				// Merge existing local data onto remote data and persist the differences.
				const remoteDocs = (await getDocs(reference)).docs;
				const remoteData = remoteDocs.map((doc) => doc.data() as Item);
				const allData = mergeCollections(remoteData, get(store));
				store.set(allData);
				currentLocalValue = allData;
				await persistCollectionChanges(reference, allData, remoteData);
			}

			const snapshotUnsub = onSnapshot(reference, (snapshot) => {
				snapshot.docChanges().forEach((docChange) => {
					// If this doc has pending writes the changes were triggered locally and don't need to be written to the store.
					if (docChange.doc.metadata.hasPendingWrites) {
						return;
					}

					if (docChange.type === "added") {
						const doesItemExist = get(store).some(
							(item) => item.id === docChange.doc.data().id
						);

						if (doesItemExist) {
							return;
						}

						store.update((value) => {
							return [...value, docChange.doc.data() as Item];
						});
					}

					if (docChange.type === "modified") {
						store.update((value) => {
							return value.map((item) => {
								if (item.id === docChange.doc.id) {
									return docChange.doc.data() as Item;
								}

								return item;
							});
						});
					}

					if (docChange.type === "removed") {
						store.update((value) => {
							return value.filter((item) => {
								return item.id !== docChange.doc.id;
							});
						});
					}
				});
			});

			const storeUnsub = store.subscribe((newLocalValue) => {
				persistCollectionChanges(
					reference,
					newLocalValue,
					currentLocalValue
				);

				currentLocalValue = newLocalValue;
			});

			cleanup = function unsubscribe() {
				snapshotUnsub();
				storeUnsub();
			};

			return cleanup;
		}

		if (userLoggedOut) {
			if (cleanup) {
				cleanup();
				cleanup = null;
			}

			store.set(initial);
		}
	});

	return store;
}

async function persistCollectionChanges<Item extends ObjectWithId>(
	collectionReference: CollectionReference<DocumentData>,
	newCollection: Item[],
	oldCollection: Item[] = []
) {
	if (isSameCollection(oldCollection, newCollection)) {
		return;
	}

	const differences = findCollectionDifferences(oldCollection, newCollection);
	const operations = differences.map((diffItem) => {
		if (diffItem.operation === "added") {
			return setDoc(doc(collectionReference, diffItem.id), diffItem.data);
		}

		if (diffItem.operation === "modified") {
			return updateDoc(
				doc(collectionReference, diffItem.id),
				diffItem.data
			);
		}

		if (diffItem.operation === "removed") {
			return deleteDoc(doc(collectionReference, diffItem.id));
		}
	});

	await Promise.all(operations);
}

/**
 * Does a deep comparison of two arrays.
 *
 * The arrays must contain objects with an `id` property, which is used to sort each arrays. This ensures we can check for deep equality without factoring in order.
 */
function isSameCollection<Item extends ObjectWithId>(
	collection: Item[],
	otherCollection: Item[]
) {
	if (collection === otherCollection) {
		return true;
	}

	function sortById(items: Item[]) {
		return [...items].sort((a, b) => compare(a.id, b.id));
	}

	return isEqual(sortById(collection), sortById(otherCollection));
}

interface Diff<Item extends ObjectWithId> {
	id: string;
	operation: "added" | "removed" | "modified";
	data: Item;
}

function findCollectionDifferences<Item extends ObjectWithId>(
	oldCollection: Item[],
	newCollection: Item[]
): Diff<Item>[] {
	const diffs: Diff<Item>[] = [];
	const oldCollectionIds = oldCollection.map((document) => document.id);
	const newCollectionIds = newCollection.map((document) => document.id);

	newCollection.forEach((newDoc) => {
		const docAlreadyExisted = oldCollectionIds.includes(newDoc.id);

		if (!docAlreadyExisted) {
			diffs.push({
				id: newDoc.id,
				operation: "added",
				data: newDoc,
			});
		}

		if (docAlreadyExisted) {
			const oldDoc = oldCollection.find((doc) => doc.id === newDoc.id);
			const documentWasModified = !isEqual(newDoc, oldDoc);

			if (documentWasModified) {
				diffs.push({
					id: newDoc.id,
					operation: "modified",
					data: newDoc,
				});
			}
		}
	});

	oldCollection.forEach((oldDoc) => {
		const docWasRemoved = !newCollectionIds.includes(oldDoc.id);

		if (docWasRemoved) {
			diffs.push({
				id: oldDoc.id,
				operation: "removed",
				data: oldDoc,
			});
		}
	});

	return diffs;
}

function mergeCollections<Item extends ObjectWithId>(
	baseCollection: Item[],
	newCollection: Item[]
): Item[] {
	const merged = [...baseCollection, ...newCollection].reduce(
		(result, item) => {
			return {
				...result,
				[item.id]: item,
			};
		},
		{} as { [id: string]: Item }
	);

	return Object.values(merged);
}

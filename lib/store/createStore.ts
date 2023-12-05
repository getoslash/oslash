import { writable } from 'svelte/store';
import { Storage } from '@plasmohq/storage/dist';
import { SHORTCUTS_STORAGE_KEY } from '~lib/constants/keys';

export function createStoreSyncedWithStorage<T>({
	key,
	initialValue
}: {
	key: string;
	initialValue: T;
}) {
	const { subscribe, set, update } = writable<T>(initialValue);
	const storage = new Storage({
    area: 'local'
  });

	async function init() {
		const valueFromStorage = await storage.get<T>(key);
		set(valueFromStorage || initialValue);
	}

	async function setValue(value: T) {
		await storage.set(key, value);
		set(value);
	}

  storage.watch({
    [SHORTCUTS_STORAGE_KEY]: () => init()
  })

	return {
		subscribe,
		init,
		set: setValue,
		update
	};
}

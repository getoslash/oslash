import type { Shortcut } from '~lib/types';
import { createStoreSyncedWithStorage } from './createStore';
import { SHORTCUTS_STORAGE_KEY } from '~lib/constants/keys';

export const shortcuts = createStoreSyncedWithStorage<Shortcut[]>({
	key: SHORTCUTS_STORAGE_KEY,
	initialValue: []
});

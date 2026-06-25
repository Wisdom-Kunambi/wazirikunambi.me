import { useSyncExternalStore } from 'react';

export const SHOOT_MODE_STORAGE_KEY = 'shoot-toggle-state';

function readShootModeFromStorage(): boolean {
    if (typeof window === 'undefined') return false;
    try {
        return window.localStorage.getItem(SHOOT_MODE_STORAGE_KEY) === 'on';
    } catch {
        return false;
    }
}

const listeners = new Set<() => void>();

export function notifyShootModeSubscribers(): void {
    for (const listener of listeners) {
        listener();
    }
}

export function subscribeShootMode(onStoreChange: () => void): () => void {
    const onStorage = (event: StorageEvent): void => {
        if (event.key === SHOOT_MODE_STORAGE_KEY || event.key === null) {
            onStoreChange();
        }
    };
    window.addEventListener('storage', onStorage);
    listeners.add(onStoreChange);
    return (): void => {
        window.removeEventListener('storage', onStorage);
        listeners.delete(onStoreChange);
    };
}

export function getShootModeSnapshot(): boolean {
    return readShootModeFromStorage();
}

export function useShootModeOn(): boolean {
    return useSyncExternalStore(subscribeShootMode, getShootModeSnapshot, () => false);
}

export function toggleShootMode(): void {
    const current = readShootModeFromStorage();
    try {
        window.localStorage.setItem(SHOOT_MODE_STORAGE_KEY, current ? 'off' : 'on');
        notifyShootModeSubscribers();
    } catch { /* ignore */ }
}

import localforage from 'localforage';

// Configure localforage
localforage.config({
  name: 'CardSortingUX',
  storeName: 'card_sorting_data',
  description: 'Local storage for Card Sorting UX application',
});

const KEYS = {
  BUILDER_STATE: 'builder_state',
  RUN_STATE: 'run_state',
  CURRENT_TEMPLATE: 'current_template',
} as const;

export async function saveBuilderState<T>(state: T): Promise<void> {
  await localforage.setItem(KEYS.BUILDER_STATE, state);
}

export async function loadBuilderState<T>(): Promise<T | null> {
  return localforage.getItem<T>(KEYS.BUILDER_STATE);
}

export async function saveRunState<T>(state: T): Promise<void> {
  await localforage.setItem(KEYS.RUN_STATE, state);
}

export async function loadRunState<T>(): Promise<T | null> {
  return localforage.getItem<T>(KEYS.RUN_STATE);
}

export async function saveCurrentTemplate<T>(template: T): Promise<void> {
  await localforage.setItem(KEYS.CURRENT_TEMPLATE, template);
}

export async function loadCurrentTemplate<T>(): Promise<T | null> {
  return localforage.getItem<T>(KEYS.CURRENT_TEMPLATE);
}

export async function clearRunState(): Promise<void> {
  await localforage.removeItem(KEYS.RUN_STATE);
  await localforage.removeItem(KEYS.CURRENT_TEMPLATE);
}

export async function clearAllData(): Promise<void> {
  await localforage.clear();
}

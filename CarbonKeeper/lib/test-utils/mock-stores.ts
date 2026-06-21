export type StoreHook<T> = {
  <U>(selector: (state: T) => U): U;
  getState: () => T;
};

export function createMockStoreHook<T>(getState: () => T): StoreHook<T> {
  const hook = ((selector: (state: T) => unknown) =>
    selector(getState())) as StoreHook<T>;
  hook.getState = getState;
  return hook;
}

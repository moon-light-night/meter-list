import { useContext } from 'react';
import { StoreContext } from '@/store/StoreProvider';
import type { RootStoreType } from '@/store/RootStore';

export function useStore(): RootStoreType {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('StoreProvider is missing in the app tree');
  }
  return store;
}

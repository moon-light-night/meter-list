import { createContext } from 'react';
import type { ReactNode } from 'react';
import { createRootStore } from '@/store/RootStore';
import type { RootStoreType } from '@/store/RootStore';

const store = createRootStore();
const StoreContext = createContext<RootStoreType | null>(store);

interface StoreProviderProps {
  children: ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

export { StoreContext };

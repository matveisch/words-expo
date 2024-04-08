import { createContext, Dispatch, SetStateAction } from 'react';

export type DataContextType = {
  openCreateDeckModal: boolean;
  setOpenCreateDeckModal: Dispatch<SetStateAction<boolean>>;
};

export const DataContext = createContext<DataContextType | null>(null);

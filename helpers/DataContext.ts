import Deck from './Deck';
import { createContext, Dispatch, SetStateAction } from 'react';

export type DataContextType = {
  currentDeck: Deck;
  setCurrentDeck: Dispatch<SetStateAction<Deck>>;
};

export const DataContext = createContext<DataContextType | null>(null);

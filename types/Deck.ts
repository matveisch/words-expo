export interface DeckType {
  id: number;
  name: string;
  parent_deck: number | null;
  user_id: string;
  color: string | null;
}

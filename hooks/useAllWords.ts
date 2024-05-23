import { useQueries, useQuery } from '@tanstack/react-query';
import { supabase } from '../helpers/initSupabase';
import { WordType } from '../types/WordType';

// export const useAllWords = (deckIds: number[], subDecksLoaded: boolean) => {
//   useQueries({
//     queries: deckIds.map((id) => ({
//       queryKey: ['words', id, subDecksLoaded],
//       queryFn: () => supabase.from('words').select().eq('deck', id).order('id'),
//       enabled: subDecksLoaded,
//       // @ts-ignore
//       select: (data): WordType[] => data.data,
//     })),
//     combine: (results) => {
//       return {
//         data: results.map((result) => result.data),
//         pending: results.some((result) => result.isPending),
//       };
//     },
//   });
// };
//

export const useAllWords = (deckIds: number[]) =>
  useQuery({
    queryKey: ['allWords', deckIds],
    queryFn: () => supabase.from('words').select().in('deck', deckIds).order('id'),
    // @ts-ignore
    select: (data): WordType[] => data.data,
    enabled: false,
  });

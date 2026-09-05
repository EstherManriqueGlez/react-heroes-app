import { useQuery } from '@tanstack/react-query';
import { getHeroesByPageAction } from '../actions/get-heroes-by-page.action';

export const useHeroCatalog = (limit: number = 200) => {
  return useQuery({
    queryKey: ['heroes-catalog', { limit }],
    queryFn: () => getHeroesByPageAction(1, limit),
    staleTime: 1000 * 60 * 5,
  });
};
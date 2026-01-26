import { heroApi } from '../api/hero.api';
import type { HeroesResponse } from '../types/get-heroes.response';

const BASE_URL = import.meta.env.VITE_API_URL;

export const getHeroesByPageAction = async (
  page: number,
  limit: number = 6,
): Promise<HeroesResponse> => {
  if(isNaN(page) || page < 1) {
    page = 1;
  }

  if(isNaN(limit) || limit < 1) {
    limit = 6;
  }

  const { data } = await heroApi.get<HeroesResponse>(`/`, {
    params: {
      limit,
      offset: (page - 1) * limit,
    },
  });

  const heroes = data.heroes.map((hero) => ({
    ...hero,
    image: `${BASE_URL}/Images/${hero.image}`,
  }));

  return { ...data, heroes: heroes };
};

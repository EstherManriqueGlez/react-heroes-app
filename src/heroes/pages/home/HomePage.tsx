import { use, useMemo } from 'react';
import { useSearchParams } from 'react-router';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomJumbotron } from '@/components/custom/CustomJumbotron';
import { HeroStats } from '@/heroes/components/HeroStats';
import { HeroGrid } from '@/heroes/components/HeroGrid';
import { CustomPagination } from '@/components/custom/CustomPagination';
import { CustomBreadcrumbs } from '@/components/custom/CustomBreadcrumbs';
import { useHeroSummary } from '@/heroes/hooks/useHeroSummary';
import { useHeroPagination } from '@/heroes/hooks/useHeroPagination';
import { FavoriteHeroContext } from '@/heroes/context/FavoriteHeroContext';

export const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { favoriteCount, favorites } = use(FavoriteHeroContext);

  const activeTab = searchParams.get('tab') ?? 'all';
  const page = searchParams.get('page') ?? '1';
  const limit = searchParams.get('limit') ?? '6';
  const category = searchParams.get('category') ?? 'all';

  const selectedTab = useMemo(() => {
    const validTabs = ['all', 'favorites', 'heroes', 'villains'];

    return validTabs.includes(activeTab) ? activeTab : 'all';
  }, [activeTab]);

  const { data: heroesResponse } = useHeroPagination(+page, +limit, category);
  const { data: summary } = useHeroSummary();

  return (
    <>
      <>
        {/* Header */}
        <CustomJumbotron
          title='Superhero Universe'
          description='Discover, explore, and manage your favorite superheroes and villains'
        />

        <CustomBreadcrumbs currentPage='Super heroes' />

        {/* Stats Dashboard */}
        <HeroStats />

        {/* Tabs */}
        <Tabs value={selectedTab} className='mb-8'>
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger
              value='all'
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set('tab', 'all');
                  prev.set('category', 'all');
                  prev.set('page', '1');
                  return prev;
                })
              }
            >
              All Characters ({summary?.totalHeroes ?? 0})
            </TabsTrigger>
            <TabsTrigger
              value='favorites'
              className='flex items-center gap-2'
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set('tab', 'favorites');
                  return prev;
                })
              }
            >
              Favorites ({favoriteCount})
            </TabsTrigger>
            <TabsTrigger
              value='heroes'
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set('tab', 'heroes');
                  prev.set('category', 'hero');
                  prev.set('page', '1');
                  return prev;
                })
              }
            >
              Heroes ({summary?.heroCount ?? 0})
            </TabsTrigger>
            <TabsTrigger
              value='villains'
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set('tab', 'villains');
                  prev.set('category', 'villain');
                  prev.set('page', '1');
                  return prev;
                })
              }
            >
              Villains ({summary?.villainCount ?? 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value='all'>
            {/* Show All Characters */}
            <HeroGrid heroes={heroesResponse?.heroes ?? []} />
          </TabsContent>

          <TabsContent value='favorites'>
            {/* Show Favorite Characters */}
            {/* <h1>Favorites</h1> */}
            <HeroGrid heroes={favorites} />
          </TabsContent>

          <TabsContent value='heroes'>
            {/* Show Heroes */}
            <h1>Heroes</h1>
            <HeroGrid heroes={heroesResponse?.heroes ?? []} />
          </TabsContent>

          <TabsContent value='villains'>
            {/* Show Villains */}
            <h1>Villains</h1>
            <HeroGrid heroes={heroesResponse?.heroes ?? []} />
          </TabsContent>
        </Tabs>

        {/* Character Grid */}

        {/* Pagination */}
        {selectedTab !== 'favorites' && (
          <CustomPagination totalPages={heroesResponse?.pages ?? 1} />
        )}
      </>
    </>
  );
};

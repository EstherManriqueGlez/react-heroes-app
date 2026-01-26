import { useMemo } from 'react';
import { getHeroesByPageAction } from '@/heroes/actions/get-heroes-by-page.action';
import { useSearchParams } from 'react-router';

import { useQuery } from '@tanstack/react-query';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomJumbotron } from '@/components/custom/CustomJumbotron';
import { HeroStats } from '@/heroes/components/HeroStats';
import { HeroGrid } from '@/heroes/components/HeroGrid';
import { CustomPagination } from '@/components/custom/CustomPagination';
import { CustomBreadcrumbs } from '@/components/custom/CustomBreadcrumbs';

export const HomePage = () => {

  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') ?? 'all';

  const selectedTab = useMemo(() => {

    const validTabs = ['all', 'favorites', 'heroes', 'villains'];

    return validTabs.includes(activeTab) ? activeTab : 'all';


  }, [activeTab]);

  /* IMPORTANT: This approach is not recommended, because it fetches data on every render */
  // useEffect(() => {
  //   getHeroesByPage().then(() => {});
  // }, []);

  // Is better to use TanStack Query to handle data fetching
  const { data: heroesResponse } = useQuery({
    queryKey: ['heroes'],
    queryFn: () => getHeroesByPageAction(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  console.log({ heroesResponse });  

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
            <TabsTrigger value='all' onClick={() => setSearchParams((prev) => {
              prev.set('tab', 'all');
              return prev;
            })}>
              All Characters (16)
            </TabsTrigger>
            <TabsTrigger
              value='favorites'
              className='flex items-center gap-2'
              onClick={() => setSearchParams((prev) => {
              prev.set('tab', 'favorites');
              return prev;
            })}
            >
              Favorites (3)
            </TabsTrigger>
            <TabsTrigger value='heroes' onClick={() => setSearchParams((prev) => {
              prev.set('tab', 'heroes');
              return prev;
            })}>
              Heroes (12)
            </TabsTrigger>
            <TabsTrigger
              value='villains'
              onClick={() => setSearchParams((prev) => {
              prev.set('tab', 'villains');
              return prev;
            })}>
              Villains (2)
            </TabsTrigger>
          </TabsList>

          <TabsContent value='all'>
            {/* Show All Characters */}
            <HeroGrid heroes={heroesResponse?.heroes ?? []} />
          </TabsContent>

          <TabsContent value='favorites'>
            {/* Show Favorite Characters */}
            <h1>Favorites</h1>
            <HeroGrid heroes={[]}/>
          </TabsContent>

          <TabsContent value='heroes'>
            {/* Show Heroes */}
            <h1>Heroes</h1>
            <HeroGrid heroes={[]}/>
          </TabsContent>

          <TabsContent value='villains'>
            {/* Show Villains */}
            <h1>Villains</h1>
            <HeroGrid heroes={[]}/>
          </TabsContent>
        </Tabs>

        {/* Character Grid */}

        {/* Pagination */}
        <CustomPagination totalPages={8} />
      </>
    </>
  );
};

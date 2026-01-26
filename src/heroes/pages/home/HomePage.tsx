import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { CustomJumbotron } from '@/components/custom/CustomJumbotron';
import { HeroStats } from '@/heroes/components/HeroStats';
import { HeroGrid } from '@/heroes/components/HeroGrid';
import { CustomPagination } from '@/components/custom/CustomPagination';
import { CustomBreadcrumbs } from '@/components/custom/CustomBreadcrumbs';
import { getHeroesByPageAction } from '@/heroes/actions/get-heroes-by-page.action';
import { useQuery } from '@tanstack/react-query';

export const HomePage = () => {
  const [activeTab, setActiveTab] = useState<
    'all' | 'favorites' | 'heroes' | 'villains'
  >('all');

  /* IMPORTANT: This approach is not recommended, because it fetches data on every render */
  // useEffect(() => {
  //   getHeroesByPage().then(() => {});
  // }, []);

  // Is better to use TanStack Query to handle data fetching
  const { data } = useQuery({
    queryKey: ['heroes'],
    queryFn: () => getHeroesByPageAction(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

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
        <Tabs value={activeTab} className='mb-8'>
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger value='all' onClick={() => setActiveTab('all')}>
              All Characters (16)
            </TabsTrigger>
            <TabsTrigger
              value='favorites'
              className='flex items-center gap-2'
              onClick={() => setActiveTab('favorites')}
            >
              Favorites (3)
            </TabsTrigger>
            <TabsTrigger value='heroes' onClick={() => setActiveTab('heroes')}>
              Heroes (12)
            </TabsTrigger>
            <TabsTrigger
              value='villains'
              onClick={() => setActiveTab('villains')}
            >
              Villains (2)
            </TabsTrigger>
          </TabsList>

          <TabsContent value='all'>
            {/* Show All Characters */}
            <HeroGrid />
          </TabsContent>

          <TabsContent value='favorites'>
            {/* Show Favorite Characters */}
            <h1>Favorites</h1>
            <HeroGrid />
          </TabsContent>

          <TabsContent value='heroes'>
            {/* Show Heroes */}
            <h1>Heroes</h1>
            <HeroGrid />
          </TabsContent>

          <TabsContent value='villains'>
            {/* Show Villains */}
            <h1>Villains</h1>
            <HeroGrid />
          </TabsContent>
        </Tabs>

        {/* Character Grid */}

        {/* Pagination */}
        <CustomPagination totalPages={8} />
      </>
    </>
  );
};

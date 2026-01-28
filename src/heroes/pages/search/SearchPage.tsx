import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import { CustomJumbotron } from '@/components/custom/CustomJumbotron';
import { HeroStats } from '@/heroes/components/HeroStats';
import { SearchControls } from './ui/SearchControls';
import { CustomBreadcrumbs } from '@/components/custom/CustomBreadcrumbs';
import { HeroGrid } from '@/heroes/components/HeroGrid';
import { searchHeroesAction } from '@/heroes/actions/search-heroes.actions';

export const SearchPage = () => {
  // TODO: Fetch and display heroes based on search criteria with useQuery
  const [searchParams] = useSearchParams();

  const name = searchParams.get('name') ?? undefined;
  const strength = Number(searchParams.get('strength') ?? undefined);

  const { data: heroes = [] } = useQuery({
    queryKey: [
      'search',
      {
        name,
        strength,
      },
    ],
    queryFn: () => searchHeroesAction({ name }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <>
      <CustomJumbotron
        title='Superhero Search'
        description='Discover, explore, and manage your favorite superheroes and villains'
      />

      <CustomBreadcrumbs
        currentPage='Search Heroes'
        // breadcrumbs={
        //   [
        //     {label: 'Home1', to: '/'},
        //     {label: 'Home2', to: '/'},
        //     {label: 'Home3', to: '/'},
        //   ]
        // }
      />

      {/* Stats Dashboard */}
      <HeroStats />

      {/* Filter and Search Controls */}
      <SearchControls />

      {/* Search Results */}
      <HeroGrid heroes={heroes} />
    </>
  );
};

export default SearchPage;

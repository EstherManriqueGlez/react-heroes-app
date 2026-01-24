import { CustomJumbotron } from '@/components/custom/CustomJumbotron';

import { HeroStats } from '@/heroes/components/HeroStats';
import { SearchControls } from './ui/SearchControls';
import { CustomBreadcrumbs } from '@/components/custom/CustomBreadcrumbs';

export const SearchPage = () => {
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
    </>
  );
};

export default SearchPage;

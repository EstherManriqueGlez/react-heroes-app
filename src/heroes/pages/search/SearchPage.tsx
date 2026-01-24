import { CustomJumbotron } from '@/components/custom/CustomJumbotron';

import { HeroStats } from '@/heroes/components/HeroStats';
import { SearchControls } from './ui/SearchControls';

export const SearchPage = () => {
  return (
    <>
      <CustomJumbotron
        title='Superhero Search'
        description='Discover, explore, and manage your favorite superheroes and villains'
      />

      {/* Stats Dashboard */}
      <HeroStats />

      {/* Filter and Search Controls */}
      <SearchControls />
    </>
  );
};

export default SearchPage;

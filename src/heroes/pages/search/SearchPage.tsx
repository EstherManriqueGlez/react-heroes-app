import { CustomJumbotron } from '@/components/custom/CustomJumbotron';
import { HeroStats } from '@/heroes/components/HeroStats';

export const SearchPage = () => {
  return (
    <>
      <CustomJumbotron
        title='Superhero Search'
        description='Discover, explore, and manage your favorite superheroes and villains'
      />

      {/* Stats Dashboard */}
      <HeroStats />
    </>
  );
};

export default SearchPage;

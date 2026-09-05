import type { Hero } from '../types/hero.interface';
import { HeroGridCard } from './HeroGridCard';
import { HeroGridRow } from './HeroGridRow';

interface Props {
  heroes: Hero[];
  layout?: 'grid' | 'list';
}

export const HeroGrid = ({ heroes, layout = 'grid' }: Props) => {
  if (layout === 'list') {
    return (
      <div className='space-y-4 mb-8'>
        {heroes.map((hero) => (
          <HeroGridRow key={hero.id} hero={hero} />
        ))}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8'>
      {heroes.map((hero) => (
        <HeroGridCard key={hero.id} hero={hero} />
      ))}
    </div>
  );
};
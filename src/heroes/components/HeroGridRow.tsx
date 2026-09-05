import { use } from 'react';
import { Link } from 'react-router';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Zap } from 'lucide-react';

import type { Hero } from '../types/hero.interface';
import { FavoriteHeroContext } from '../context/FavoriteHeroContext';

interface Props {
  hero: Hero;
}

export const HeroGridRow = ({ hero }: Props) => {
  const { isFavorite, toggleFavorite } = use(FavoriteHeroContext);

  return (
    <Card className='group overflow-hidden hover:shadow-lg transition-shadow'>
      <div className='flex flex-col sm:flex-row'>
        <Link
          to={`/heroes/${hero.slug}`}
          className='sm:w-40 shrink-0 overflow-hidden'
          aria-label={`View details for ${hero.alias}`}
        >
          <img
            src={hero.image}
            alt={hero.alias}
            loading='lazy'
            className='h-48 w-full object-cover sm:h-full transition-transform duration-500 group-hover:scale-105'
          />
        </Link>

        <CardContent className='flex flex-1 flex-col gap-2 p-5'>
          <div className='flex items-start justify-between gap-3'>
            <div className='space-y-1'>
              <Link to={`/heroes/${hero.slug}`} className='hover:underline'>
                <h3 className='font-bold text-lg leading-tight'>{hero.alias}</h3>
              </Link>
              <p className='text-sm text-gray-600'>{hero.name}</p>
            </div>
            <Button
              size='icon-sm'
              variant='ghost'
              onClick={() => toggleFavorite(hero)}
              aria-label={
                isFavorite(hero)
                  ? `Remove ${hero.alias} from favorites`
                  : `Add ${hero.alias} to favorites`
              }
            >
              <Heart
                className={`h-4 w-4 ${isFavorite(hero) ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
              />
            </Button>
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            <Badge className='text-xs'>{hero.category}</Badge>
            <Badge variant='secondary' className='text-xs'>
              {hero.status}
            </Badge>
            <Badge variant='outline' className='text-xs'>
              {hero.universe}
            </Badge>
            <Badge variant='outline' className='text-xs'>
              {hero.team}
            </Badge>
          </div>

          <p className='text-sm text-gray-600 line-clamp-1'>{hero.description}</p>

          <div className='flex items-center gap-1 text-xs text-muted-foreground'>
            <Zap className='h-3.5 w-3.5 text-orange-500' />
            <span>
              Strength: {hero.strength} · Intelligence: {hero.intelligence} ·
              Speed: {hero.speed} · Durability: {hero.durability}
            </span>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
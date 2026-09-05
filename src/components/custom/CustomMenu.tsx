import { use } from 'react';
import { Link, useLocation } from 'react-router';
import { Heart, Sparkles } from 'lucide-react';

import { FavoriteHeroContext } from '@/heroes/context/FavoriteHeroContext';
import { cn } from '@/lib/utils';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/search', label: 'Search' },
];

export const CustomMenu = () => {
  const { pathname } = useLocation();
  const { favoriteCount } = use(FavoriteHeroContext);

  const isActive = (path: string) => pathname === path;

  return (
    <header className='sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5'>
        <Link
          to='/'
          className='flex shrink-0 items-center gap-2 text-lg font-bold text-slate-900'
        >
          <span className='flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white'>
            <Sparkles className='h-5 w-5' />
          </span>
          <span className='hidden sm:inline'>Superhero Universe</span>
        </Link>

        <nav
          aria-label='Main navigation'
          className='flex items-center gap-1'
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive(link.to)
                  ? 'bg-slate-200 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              )}
              aria-current={isActive(link.to) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          to='/?tab=favorites'
          aria-label={`Favorites: ${favoriteCount}`}
          title='View favorites'
          className='relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900'
        >
          <Heart
            className={cn(
              'h-5 w-5',
              favoriteCount > 0 && 'fill-red-500 text-red-500',
            )}
          />
          {favoriteCount > 0 && (
            <span className='absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white'>
              {favoriteCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};
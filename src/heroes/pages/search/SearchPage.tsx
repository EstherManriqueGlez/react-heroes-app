import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import { CustomJumbotron } from '@/components/custom/CustomJumbotron';
import { CustomBreadcrumbs } from '@/components/custom/CustomBreadcrumbs';
import { EmptyState } from '@/components/custom/EmptyState';
import { SearchX, Sparkles } from 'lucide-react';
import { HeroStats } from '@/heroes/components/HeroStats';
import { HeroGrid } from '@/heroes/components/HeroGrid';
import { SearchControls } from './ui/SearchControls';
import { searchHeroesAction } from '@/heroes/actions/search-heroes.actions';
import { useHeroCatalog } from '@/heroes/hooks/useHeroCatalog';
import { useHeroSummary } from '@/heroes/hooks/useHeroSummary';

export const SearchPage = () => {
  const [searchParams] = useSearchParams();

  const name = searchParams.get('name') ?? undefined;
  const strength = searchParams.get('strength') ?? undefined;
  const team = searchParams.get('team') ?? undefined;
  const category = searchParams.get('category') ?? undefined;
  const universe = searchParams.get('universe') ?? undefined;
  const status = searchParams.get('status') ?? undefined;
  const sort = searchParams.get('sort') ?? '';
  const view = searchParams.get('view') ?? 'grid';

  const { data: summary } = useHeroSummary();
  const { data: catalogData = { heroes: [] } } = useHeroCatalog(
    summary?.totalHeroes ?? 200,
  );
  const catalog = catalogData.heroes;

  const { data: heroes = [], isFetching } = useQuery({
    queryKey: ['search', { name, strength, team, category, universe, status }],
    queryFn: () =>
      searchHeroesAction({
        name,
        strength,
        team,
        category,
        universe,
        status,
      }),
    staleTime: 1000 * 60 * 5,
  });

  const sortedHeroes = useMemo(() => {
    if (sort === 'name-desc') {
      return [...heroes].sort((a, b) => b.alias.localeCompare(a.alias));
    }

    if (sort === 'name-asc') {
      return [...heroes].sort((a, b) => a.alias.localeCompare(b.alias));
    }

    return heroes;
  }, [heroes, sort]);

  const hasActiveFilters = Boolean(
    name || strength || team || category || universe || status,
  );

  return (
    <div data-testid='search-page'>
      <CustomJumbotron
        title='Superhero Search'
        description='Search, filter, and sort your way through the universe'
      />

      <CustomBreadcrumbs currentPage='Search' />

      <HeroStats />

      <SearchControls heroes={catalog} />

      {/* Results header */}
      {hasActiveFilters && (
        <div className='flex items-center justify-between mb-4'>
          <p className='text-sm text-muted-foreground' data-testid='result-count'>
            {isFetching
              ? 'Searching...'
              : `${sortedHeroes.length} ${sortedHeroes.length === 1 ? 'result' : 'results'} found`}
          </p>
        </div>
      )}

      {/* Search Results */}
      {sortedHeroes.length > 0 ? (
        <HeroGrid heroes={sortedHeroes} layout={view} />
      ) : (
        <EmptyState
          icon={hasActiveFilters ? SearchX : Sparkles}
          title={hasActiveFilters ? 'No characters found' : 'Find your hero'}
          description={
            hasActiveFilters
              ? 'No character matches the current filters. Try adjusting or clearing them.'
              : 'Type a name, adjust filters, or find your favorite hero and villain from the universe.'
          }
        />
      )}
    </div>
  );
};

export default SearchPage;
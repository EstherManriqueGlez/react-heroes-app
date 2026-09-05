import { use, useMemo } from 'react';
import { useSearchParams } from 'react-router';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomJumbotron } from '@/components/custom/CustomJumbotron';
import { EmptyState } from '@/components/custom/EmptyState';
import { Heart } from 'lucide-react';
import { HeroStats } from '@/heroes/components/HeroStats';
import { HeroGrid } from '@/heroes/components/HeroGrid';
import { HeroGridSkeleton } from '@/heroes/components/HeroGridSkeleton';
import { CustomPagination } from '@/components/custom/CustomPagination';
import { CustomBreadcrumbs } from '@/components/custom/CustomBreadcrumbs';
import { useHeroSummary } from '@/heroes/hooks/useHeroSummary';
import { useHeroPagination } from '@/heroes/hooks/useHeroPagination';
import { FavoriteHeroContext } from '@/heroes/context/FavoriteHeroContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { favoriteCount, favorites } = use(FavoriteHeroContext);

  useDocumentTitle('Home');

  const activeTab = searchParams.get('tab') ?? 'all';
  const page = searchParams.get('page') ?? '1';
  const limit = searchParams.get('limit') ?? '6';
  const category = searchParams.get('category') ?? 'all';

  const selectedTab = useMemo(() => {
    const validTabs = ['all', 'favorites', 'heroes', 'villains'];

    return validTabs.includes(activeTab) ? activeTab : 'all';
  }, [activeTab]);

  const { data: heroesResponse } = useHeroPagination(+page, +limit, category);
  const { data: summary } = useHeroSummary();

  const isLoadingHeroes = selectedTab !== 'favorites' && !heroesResponse;

  const renderCharacterList = () => {
    if (isLoadingHeroes) {
      return <HeroGridSkeleton />;
    }

    const heroes = heroesResponse?.heroes ?? [];

    if (heroes.length === 0) {
      return (
        <EmptyState
          title="No characters found"
          description="There are no characters available for this filter."
        />
      );
    }

    return <HeroGrid heroes={heroes} />;
  };

  return (
    <div data-testid="home-page">
      {/* Header */}
      <CustomJumbotron
        title="Superhero Universe"
        description="Discover, explore, and manage your favorite heroes and villains"
      />

      <CustomBreadcrumbs currentPage="Home" />

      {/* Stats Dashboard */}
      <HeroStats />

      {/* Tabs */}
      <Tabs value={selectedTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger
            value="all"
            onClick={() =>
              setSearchParams((prev) => {
                prev.set('tab', 'all');
                prev.set('category', 'all');
                prev.set('page', '1');
                return prev;
              })
            }
          >
            All Characters ({summary?.totalHeroes ?? 0})
          </TabsTrigger>
          <TabsTrigger
            value="favorites"
            className="flex items-center gap-2"
            onClick={() =>
              setSearchParams((prev) => {
                prev.set('tab', 'favorites');
                return prev;
              })
            }
          >
            Favorites ({favoriteCount})
          </TabsTrigger>
          <TabsTrigger
            value="heroes"
            onClick={() =>
              setSearchParams((prev) => {
                prev.set('tab', 'heroes');
                prev.set('category', 'hero');
                prev.set('page', '1');
                return prev;
              })
            }
          >
            Heroes ({summary?.heroCount ?? 0})
          </TabsTrigger>
          <TabsTrigger
            value="villains"
            onClick={() =>
              setSearchParams((prev) => {
                prev.set('tab', 'villains');
                prev.set('category', 'villain');
                prev.set('page', '1');
                return prev;
              })
            }
          >
            Villains ({summary?.villainCount ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">{renderCharacterList()}</TabsContent>

        <TabsContent value="favorites">
          {favorites.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="No favorites yet"
              description="Tap the heart icon on any character to add them to your favorites and find them here."
            />
          ) : (
            <HeroGrid heroes={favorites} />
          )}
        </TabsContent>

        <TabsContent value="heroes">{renderCharacterList()}</TabsContent>

        <TabsContent value="villains">{renderCharacterList()}</TabsContent>
      </Tabs>

      {/* Pagination */}
      {selectedTab !== 'favorites' &&
        (isLoadingHeroes ? (
          <div className="mb-8 flex items-center justify-center gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-20" />
          </div>
        ) : (
          <CustomPagination
            totalPages={heroesResponse?.pages ?? 1}
            totalItems={heroesResponse?.total}
            pageSize={+limit}
          />
        ))}
    </div>
  );
};
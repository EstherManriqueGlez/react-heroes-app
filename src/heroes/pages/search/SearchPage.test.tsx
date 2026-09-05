import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { SearchPage } from './SearchPage';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { searchHeroesAction } from '@/heroes/actions/search-heroes.actions';
import { useHeroCatalog } from '@/heroes/hooks/useHeroCatalog';
import type { Hero } from '@/heroes/types/hero.interface';

vi.mock('@/heroes/actions/search-heroes.actions');
const mockedSearchHeroesAction = vi.mocked(searchHeroesAction);

mockedSearchHeroesAction.mockResolvedValue([]);

vi.mock('@/heroes/hooks/useHeroCatalog');
const mockedUseHeroCatalog = vi.mocked(useHeroCatalog);

mockedUseHeroCatalog.mockReturnValue({
  data: { total: 0, pages: 1, heroes: [] },
} as unknown as ReturnType<typeof useHeroCatalog>);

vi.mock('@/components/custom/CustomJumbotron', () => ({
  CustomJumbotron: () => <div data-testid='custom-jumbotron-mock'></div>,
}));

vi.mock('./ui/SearchControls', () => ({
  SearchControls: () => <div data-testid='search-controls-mock'></div>,
}));

vi.mock('@/heroes/components/HeroGrid', () => ({
  HeroGrid: ({ heroes }: { heroes: Hero[] }) => (
    <div data-testid='hero-grid'>
      {heroes.map((hero) => (
        <div key={hero.id}>{hero.name}</div>
      ))}
    </div>
  ),
}));

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

const renderSearchPage = (initialEntries: string[] = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={createQueryClient()}>
        <SearchPage />
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

describe('SearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render SearchPage component with default values', () => {
    renderSearchPage();

    expect(mockedSearchHeroesAction).toHaveBeenCalledWith({
      name: undefined,
      strength: undefined,
      team: undefined,
      category: undefined,
      universe: undefined,
      status: undefined,
    });
  });

  test('should render SearchPage with default snapshot', () => {
    const { container } = renderSearchPage();

    expect(container).toMatchSnapshot();
  });

  test('should call search action with name and strength from query params', () => {
    const { container } = renderSearchPage(['/search?name=man&strength=6']);

    expect(mockedSearchHeroesAction).toHaveBeenCalledWith({
      name: 'man',
      strength: '6',
      team: undefined,
      category: undefined,
      universe: undefined,
      status: undefined,
    });
    expect(container).toMatchSnapshot();
  });

  test('should call search action with advanced filter params', () => {
    renderSearchPage([
      '/search?name=man&team=Justice League&category=Hero&universe=DC&status=Active',
    ]);

    expect(mockedSearchHeroesAction).toHaveBeenCalledWith({
      name: 'man',
      strength: undefined,
      team: 'Justice League',
      category: 'Hero',
      universe: 'DC',
      status: 'Active',
    });
  });

  test('should display HeroGrid with search results', async () => {
    const mockHeroes = [
      { id: '1', name: 'Clark Kent' } as unknown as Hero,
      { id: '2', name: 'Bruce Wayne' } as unknown as Hero,
    ];

    mockedSearchHeroesAction.mockResolvedValue(mockHeroes);
    renderSearchPage();

    await waitFor(() => {
      expect(screen.getByText('Clark Kent')).toBeDefined();
      expect(screen.getByText('Bruce Wayne')).toBeDefined();
    });
  });
});
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { SearchPage } from './SearchPage';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { searchHeroesAction } from '@/heroes/actions/search-heroes.actions';
import type { Hero } from '@/heroes/types/hero.interface';

vi.mock('@/heroes/actions/search-heroes.actions');
const mockedSearchHeroesAction = vi.mocked(searchHeroesAction);

vi.mock('@/components/custom/CustomJumbotron', () => ({
  CustomJumbotron: () => <div data-testid='custom-jumbotron-mock'></div>,
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

const queryClient = new QueryClient();

const renderSearchPage = (initialEntries: string[] = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={queryClient}>
        {/* <FavoriteHeroProvider> */}
        <SearchPage />
        {/* </FavoriteHeroProvider> */}
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
    });
    // screen.debug();
  });

  test('should render CustomJumbotron component with default values', () => {
    const { container } = renderSearchPage();

    expect(mockedSearchHeroesAction).toHaveBeenCalledWith({
      name: undefined,
      strength: undefined,
    });

    expect(container).toMatchSnapshot();
    // screen.debug();
  });

  test('should call search action with name and strength from query params', () => {
    const { container } = renderSearchPage(['/search?name=man&strength=6']);

    expect(mockedSearchHeroesAction).toHaveBeenCalledWith({
      name: 'man',
      strength: '6',
    });
    expect(container).toMatchSnapshot();
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
      screen.debug(screen.getByTestId('hero-grid'));
    });
  });
});

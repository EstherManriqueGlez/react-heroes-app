import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { HomePage } from './HomePage';
import { MemoryRouter } from 'react-router';
import { useHeroPagination } from '@/heroes/hooks/useHeroPagination';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FavoriteHeroProvider } from '@/heroes/context/FavoriteHeroContext';

vi.mock('@/heroes/hooks/useHeroPagination');

const mockedUseHeroPagination = vi.mocked(useHeroPagination);

mockedUseHeroPagination.mockReturnValue({
  data: [],
  isLoading: false,
  isError: false,
  isSuccess: true,
} as unknown as ReturnType<typeof useHeroPagination>);

const queryClient = new QueryClient();

const renderHomePage = (initialEntries: string[] = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={queryClient}>
        <FavoriteHeroProvider>
          <HomePage />
        </FavoriteHeroProvider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

describe('HomePage', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render HomePage component with default values', () => {
    const { container } = renderHomePage();

    // screen.debug();
    expect(container).toMatchSnapshot();
  });

  test('should call useHeroPagination with default values', () => {
    renderHomePage();

    expect(mockedUseHeroPagination).toHaveBeenCalledWith(1, 6, 'all');
  });

  test('should call useHeroPagination with custom query params', () => {
    renderHomePage(['/?page=2&limit=10&category=villains']);

    expect(mockedUseHeroPagination).toHaveBeenCalledWith(2, 10, 'villains');
  });

  test('should call useHeroPagination with default page and same limit when tab is favorites', () => {
    renderHomePage(['/?tab=favorites&page=2&limit=10']);

    // const [allTab, favoritesTab, heroesTab, villainsTab] = screen.getAllByRole('tab');
    const [, , , villainsTab] = screen.getAllByRole('tab');

    // screen.debug(villainsTab);

    fireEvent.click(villainsTab);
    expect(mockedUseHeroPagination).toHaveBeenCalledWith(1, 10, 'villain');

    // expect(mockedUseHeroPagination).toHaveBeenCalledWith(2, 10, 'villains');
  });
});

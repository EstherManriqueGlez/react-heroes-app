import { use } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import {
  FavoriteHeroContext,
  FavoriteHeroProvider,
} from './FavoriteHeroContext';
import type { Hero } from '../types/hero.interface';

const mockHero = {
  id: '1',
  name: 'batman',
} as Hero;

// Example of test with mock over global objects like localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

const TestComponent = () => {
  const { favoriteCount, favorites, isFavorite, toggleFavorite } =
    use(FavoriteHeroContext);

  return (
    <div>
      <div data-testid='favorite-count'>{favoriteCount}</div>
      <div data-testid='favorites-list'>
        {favorites.map((hero) => (
          <div key={hero.id} data-testid={`favorite-hero-${hero.id}`}>
            {hero.name}
          </div>
        ))}
      </div>
      <button
        data-testid='toggle-favorite'
        onClick={() => toggleFavorite(mockHero)}
      >
        Toggle Favorite
      </button>
      <div data-testid='is-favorite'>{isFavorite(mockHero).toString()}</div>
    </div>
  );
};

const renderContextTestComponent = () => {
  return render(
    <FavoriteHeroProvider>
      <TestComponent />
    </FavoriteHeroProvider>,
  );
};

describe('FavoriteHeroContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  test('should initialize with default values', () => {

    renderContextTestComponent();
    screen.debug();


    expect(screen.getByTestId('favorite-count').textContent).toBe('0');
    expect(screen.getByTestId('favorites-list').children.length).toBe(0);
  });

  test('should add to favorites when toggleFavorite is called with a new hero', () => {
    renderContextTestComponent();
    const toggleButton = screen.getByTestId('toggle-favorite');

    fireEvent.click(toggleButton);
    // screen.debug();

    expect(screen.getByTestId('favorite-count').textContent).toBe('1');
    expect(screen.getByTestId('favorites-list').children.length).toBe(1);
    expect(screen.getByTestId('favorite-hero-1').textContent).toBe('batman');
    expect(screen.getByTestId('is-favorite').textContent).toBe('true');

    expect(mockLocalStorage.setItem).toHaveBeenCalled();
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'favoriteHeroes',
      '[{"id":"1","name":"batman"}]',
    );
  });

  test('should remove hero from favorites when toggleFavorite is called', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockHero]));

    renderContextTestComponent();

    const toggleButton = screen.getByTestId('toggle-favorite');
    fireEvent.click(toggleButton);

    // screen.debug();

    expect(screen.getByTestId('favorite-count').textContent).toBe('0');
    expect(screen.getByTestId('favorites-list').children.length).toBe(0);
    expect(screen.queryByTestId('favorite-hero-1')).toBeNull();
    expect(screen.getByTestId('is-favorite').textContent).toBe('false');

    expect(mockLocalStorage.setItem).toHaveBeenCalled();
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'favoriteHeroes',
      '[]',
    );

  });
});

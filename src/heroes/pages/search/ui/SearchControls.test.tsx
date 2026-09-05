import { describe, expect, test } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { SearchControls } from './SearchControls';
import { MemoryRouter } from 'react-router';
import type { Hero } from '@/heroes/types/hero.interface';

if (typeof window.ResizeObserver === 'undefined') {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;
}

const mockHeroes = [
  {
    id: '1',
    team: 'Justice League',
    category: 'Hero',
    universe: 'DC',
    status: 'Active',
  },
  {
    id: '2',
    team: 'Avengers',
    category: 'Hero',
    universe: 'Marvel',
    status: 'Retired',
  },
] as Hero[];

const renderSearchControlsWithRouter = (
  initialEntries: string[] = ['/'],
  heroes: Hero[] = [],
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <SearchControls heroes={heroes} />
    </MemoryRouter>,
  );
};

describe('SearchControls', () => {
  test('should render SearchControls component with default values', () => {
    const { container } = renderSearchControlsWithRouter();

    expect(container).toMatchSnapshot();
  });

  test('should set input value when search param name is set', () => {
    renderSearchControlsWithRouter(['/search?name=Batman']);

    const input = screen.getByPlaceholderText(
      'Search heroes, villains, powers, teams...',
    );

    expect(input.getAttribute('value')).toBe('Batman');
  });

  test('should update input value while typing', () => {
    renderSearchControlsWithRouter(['/search?name=Batman']);
    const input = screen.getByPlaceholderText(
      'Search heroes, villains, powers, teams...',
    );

    fireEvent.change(input, { target: { value: 'Superman' } });

    expect(input.getAttribute('value')).toBe('Superman');
  });

  test('should render filter options derived from heroes prop', () => {
    renderSearchControlsWithRouter(
      ['/search?active-accordion=advanced-filters'],
      mockHeroes,
    );

    const teamSelect = screen.getByLabelText('Team');
    const categorySelect = screen.getByLabelText('Category');
    const universeSelect = screen.getByLabelText('Universe');
    const statusSelect = screen.getByLabelText('Status');

    expect(teamSelect.textContent).toContain('Justice League');
    expect(teamSelect.textContent).toContain('Avengers');
    expect(categorySelect.textContent).toContain('Hero');
    expect(universeSelect.textContent).toContain('DC');
    expect(universeSelect.textContent).toContain('Marvel');
    expect(statusSelect.textContent).toContain('Active');
    expect(statusSelect.textContent).toContain('Retired');
  });

  test('should show sort button as active when sort param is set', () => {
    renderSearchControlsWithRouter(['/search?sort=name-desc']);

    const sortButton = screen.getByRole('button', { name: /Name \(Z-A\)/i });
    expect(sortButton.getAttribute('aria-pressed')).toBe('true');
  });

  test('should change strength slider value', () => {
    renderSearchControlsWithRouter([
      '/search?name=Batman&active-accordion=advanced-filters',
    ]);
    const slider = screen.getByRole('slider');
    expect(slider.getAttribute('aria-valuenow')).toBe('0');

    fireEvent.keyDown(slider, { key: 'ArrowRight', code: 'ArrowRight' });
    fireEvent.keyDown(slider, { key: 'ArrowRight', code: 'ArrowRight' });
    fireEvent.keyDown(slider, { key: 'ArrowRight', code: 'ArrowRight' });

    expect(slider.getAttribute('aria-valuenow')).toBe('3');
  });

  test('should accordion be open when active-accordion param is set', () => {
    renderSearchControlsWithRouter([
      '/search?name=Batman&active-accordion=advanced-filters',
    ]);

    const accordion = screen.getByTestId('accordion');
    const accordionItem = accordion.querySelector('div');

    expect(accordionItem?.getAttribute('data-state')).toBe('open');
  });

  test('should accordion be closed when active-accordion param is not set', () => {
    renderSearchControlsWithRouter(['/search?name=Batman']);

    const accordion = screen.getByTestId('accordion');
    const accordionItem = accordion.querySelector('div');

    expect(accordionItem?.getAttribute('data-state')).toBe('closed');
  });
});
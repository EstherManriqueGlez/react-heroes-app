import { describe, expect, test } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { SearchControls } from './SearchControls';
import { MemoryRouter } from 'react-router';

if (typeof window.ResizeObserver === 'undefined') {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;
}

const renderSearchControlsWithRouter = (initialEntries: string[] = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <SearchControls />
    </MemoryRouter>,
  );
};

describe('SearchControls', () => {
  test('should render SearchControls component with default values', () => {
    const { container } = renderSearchControlsWithRouter();

    // screen.debug();
    expect(container).toMatchSnapshot();
  });

  test('should set input value when search param name is set', () => {
    renderSearchControlsWithRouter(['/search?name=Batman']);

    const input = screen.getByPlaceholderText(
      'Search heroes, villains, powers, teams...',
    );

    expect(input.getAttribute('value')).toBe('Batman');
  });

  test('should change params when input is changed and key enter is pressed', () => {
    renderSearchControlsWithRouter(['/search?name=Batman']);
    const input = screen.getByPlaceholderText(
      'Search heroes, villains, powers, teams...',
    );

    expect(input.getAttribute('value')).toBe('Batman');

    // Simulate user typing 'superman' and pressing Enter
    fireEvent.change(input, { target: { value: 'Superman' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // screen.debug(input);

    expect(input.getAttribute('value')).toBe('Superman');
  });

  test('should not change params when input is changed and other key than enter is pressed', () => {
    renderSearchControlsWithRouter(['/search?name=Batman']);
    const input = screen.getByPlaceholderText(
      'Search heroes, villains, powers, teams...',
    );
    expect(input.getAttribute('value')).toBe('Batman');

    // Simulate user typing 'superman' and pressing a key other than Enter
    fireEvent.change(input, { target: { value: 'Superman' } });
    fireEvent.keyDown(input, { key: 'a' });
    expect(input.getAttribute('value')).toBe('Batman');
  });

  test('should change params when strength slider is changed', () => {
    renderSearchControlsWithRouter([
      '/search?name=Batman&active-accordion=advanced-filters',
    ]);
    const slider = screen.getByRole('slider');
    expect(slider.getAttribute('aria-valuenow')).toBe('0');

    // Simulate user changing the slider value
    fireEvent.keyDown(slider, { key: 'ArrowRight', code: 'ArrowRight' });
    fireEvent.keyDown(slider, { key: 'ArrowRight', code: 'ArrowRight' });
    fireEvent.keyDown(slider, { key: 'ArrowRight', code: 'ArrowRight' });

    expect(slider.getAttribute('aria-valuenow')).toBe('3');

    // screen.debug(slider);
  });

  test('should accordion be open when active-accordion param is set', () => {
    renderSearchControlsWithRouter([
      '/search?name=Batman&active-accordion=advanced-filters',
    ]);

    const accordion = screen.getByTestId('accordion');
    const accordionItem = accordion.querySelector('div');

    // screen.debug(accordion);

    expect(accordionItem?.getAttribute('data-state')).toBe('open');
  });

   test('should accordion be closed when active-accordion param is not set', () => {
    renderSearchControlsWithRouter([
      '/search?name=Batman',
    ]);

    const accordion = screen.getByTestId('accordion');
    const accordionItem = accordion.querySelector('div');

    // screen.debug(accordion);

    expect(accordionItem?.getAttribute('data-state')).toBe('closed');
  });
});

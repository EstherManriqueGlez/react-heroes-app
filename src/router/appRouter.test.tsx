import {
  createMemoryRouter,
  Outlet,
  RouterProvider,
  useParams,
} from 'react-router';
import { describe, expect, test, vi } from 'vitest';
import { appRouter } from './app.router';
import { render, screen } from '@testing-library/react';

vi.mock('@/heroes/layouts/HeroesLayout', () => ({
  HeroesLayout: () => (
    <div data-testid='heroes-layout'>
      <Outlet />
    </div>
  ),
}));

vi.mock('@/heroes/pages/home/HomePage', () => ({
  HomePage: () => <div data-testid='home-page'>Mocked Home Page</div>,
}));

vi.mock('@/heroes/pages/hero/HeroPage', () => ({
  HeroPage: () => {
    const { idSlug = '' } = useParams();

    return <div data-testid='hero-page'>HeroPage - {idSlug}</div>;
  },
}));

vi.mock('@/heroes/pages/search/SearchPage', () => ({
  default: () => <div data-testid='search-page'>Mocked Search Page</div>,
}));

describe('appRouter', () => {
  test('should be configured correctly', () => {
    //  console.log(appRouter.routes);

    expect(appRouter.routes).toMatchSnapshot();
  });

  test('should render home page at root path', () => {
    const router = createMemoryRouter(appRouter.routes, {
      initialEntries: ['/'],
    });

    render(<RouterProvider router={router} />);

    // screen.debug();

    expect(screen.getByTestId('home-page')).toBeDefined();
  });

  test('should render hero page at /heroes/:idSlug path', () => {
    const router = createMemoryRouter(appRouter.routes, {
      initialEntries: ['/heroes/superman'],
    });

    render(<RouterProvider router={router} />);

    // screen.debug();
    expect(screen.getByTestId('hero-page').innerHTML).toContain('superman');
  });

  // IMPORTANT: This is the way to test lazy loaded routes
  test('should render search page at /search path', async () => {
    const router = createMemoryRouter(appRouter.routes, {
      initialEntries: ['/search'],
    });

    render(<RouterProvider router={router} />);
    //  screen.debug();

    expect(await screen.findByTestId('search-page')).toBeDefined();
    //  screen.debug();


  });
});

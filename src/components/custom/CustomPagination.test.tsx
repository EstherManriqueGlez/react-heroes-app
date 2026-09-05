import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { CustomPagination } from './CustomPagination';
import { MemoryRouter } from 'react-router';
import type { PropsWithChildren } from 'react';

vi.mock('../ui/button', () => ({
  Button: ({ children, ...props }: PropsWithChildren) => (
    <button {...props}>{children}</button>
  ),
}));

const renderWithRouter = (
  component: React.ReactElement,
  initialEntries?: string[],
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>,
  );
};

describe('CustomPagination', () => {
  test('should render all page numbers when totalPages is small', () => {
    renderWithRouter(<CustomPagination totalPages={5} />);

    expect(screen.getByText('Previous')).toBeDefined();
    expect(screen.getByText('Next')).toBeDefined();

    for (let i = 1; i <= 5; i++) {
      expect(screen.getByText(i.toString())).toBeDefined();
    }
  });

  test('should disable Previous button on first page', () => {
    renderWithRouter(<CustomPagination totalPages={5} />);
    const previousButton = screen.getByRole('button', { name: 'Previous page' });

    expect(previousButton.getAttributeNames()).toContain('disabled');
  });

  test('should disable Next button on last page', () => {
    renderWithRouter(<CustomPagination totalPages={5} />, ['/?page=5']);
    const nextButton = screen.getByRole('button', { name: 'Next page' });

    expect(nextButton.getAttributeNames()).toContain('disabled');
  });

  test('should define the variant attribute correctly when we are in page 3', () => {
    renderWithRouter(<CustomPagination totalPages={5} />, ['/?page=3']);
    const button2 = screen.getByText('2');
    const button3 = screen.getByText('3');

    expect(button2.getAttribute('variant')).toContain('outline');
    expect(button3.getAttribute('variant')).toContain('default');
  });

  test('should change page when clicking on a page number', async () => {
    renderWithRouter(<CustomPagination totalPages={5} />, ['/?page=3']);
    const button2 = screen.getByText('2');
    const button3 = screen.getByText('3');

    expect(button2.getAttribute('variant')).toContain('outline');
    expect(button3.getAttribute('variant')).toContain('default');

    fireEvent.click(button2);
    expect(button2.getAttribute('variant')).toContain('default');
    expect(button3.getAttribute('variant')).toContain('outline');
  });

  test('should render ellipsis and window for large ranges', () => {
    renderWithRouter(<CustomPagination totalPages={10} />, ['/?page=5']);

    expect(screen.getByText('1')).toBeDefined();
    expect(screen.getByText('4')).toBeDefined();
    expect(screen.getByText('5')).toBeDefined();
    expect(screen.getByText('6')).toBeDefined();
    expect(screen.getByText('10')).toBeDefined();

    expect(screen.getAllByText('…')).toHaveLength(2);
  });

  test('should not render ellipsis on edges of a large range', () => {
    renderWithRouter(<CustomPagination totalPages={10} />, ['/?page=1']);

    expect(screen.getByText('1')).toBeDefined();
    expect(screen.getByText('2')).toBeDefined();
    expect(screen.getByText('10')).toBeDefined();
    expect(screen.getAllByText('…')).toHaveLength(1);
  });

  test('should show the showing range text when totalItems is provided', () => {
    renderWithRouter(
      <CustomPagination totalPages={5} totalItems={30} pageSize={6} />,
      ['/?page=2'],
    );

    expect(screen.getByText('Showing 7-12 of 30')).toBeDefined();
  });
});
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
  test('should render component correctly with default values ', () => {
    renderWithRouter(<CustomPagination totalPages={5} />);

    // screen.debug();

    expect(screen.getByText('Previous')).toBeDefined();
    expect(screen.getByText('Next')).toBeDefined();

    // expect(screen.getByText('1')).toBeDefined();
    // expect(screen.getByText('2')).toBeDefined();
    // expect(screen.getByText('3')).toBeDefined();
    // expect(screen.getByText('4')).toBeDefined();
    // expect(screen.getByText('5')).toBeDefined();

    // It's better this way to avoid repeating code
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByText(i.toString())).toBeDefined();
    }
  });

  test('should disable Previous button on first page', () => {
    renderWithRouter(<CustomPagination totalPages={5} />);
    const previousButton = screen.getByText('Previous');

    // screen.debug(previousButton);

    expect(previousButton.getAttributeNames()).toContain('disabled');
  });

  test('should disable Next button on last page', () => {
    renderWithRouter(<CustomPagination totalPages={5} />, ['/?page=5']);
    const nextButton = screen.getByText('Next');
    
    // screen.debug(nextButton);

    expect(nextButton.getAttributeNames()).toContain('disabled');
  });

   test('should define the variant attribute correctly when we are in page 3', () => {
    renderWithRouter(<CustomPagination totalPages={5} />, ['/?page=3']);
    const button2 = screen.getByText('2');
    const button3 = screen.getByText('3');
    
    // screen.debug(button2);
    // screen.debug(button3);

    expect(button2.getAttribute('variant')).toContain('outline');
    expect(button3.getAttribute('variant')).toContain('default');
  });

  test('should change page when clicking on a page number', async () => {
    renderWithRouter(<CustomPagination totalPages={5} />, ['/?page=3']);
    const button2 = screen.getByText('2');
    const button3 = screen.getByText('3');

    expect(button2.getAttribute('variant')).toContain('outline');
    expect(button3.getAttribute('variant')).toContain('default');

    // screen.debug(button3);

    fireEvent.click(button2);
    expect(button2.getAttribute('variant')).toContain('default');
    expect(button3.getAttribute('variant')).toContain('outline');
    // screen.debug(button3);

  });
});

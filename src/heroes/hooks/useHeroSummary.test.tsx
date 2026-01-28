import { describe, expect, test, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type PropsWithChildren } from 'react';
import { useHeroSummary } from './useHeroSummary';
import { getSummaryAction } from '../actions/get-summary.action';
import type { SummaryInformationResponse } from '../types/summary-information.response';

vi.mock('../actions/get-summary.action', () => ({
  getSummaryAction: vi.fn(),
}));

const mockedGetSummaryAction = vi.mocked(getSummaryAction);

const tanStackCustomProvider = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useHeroSummary', () => {
  test('should return the initial state (isLoading)', () => {
    const { result } = renderHook(() => useHeroSummary(), {
      wrapper: tanStackCustomProvider(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.data).toBe(undefined);
    expect(result.current.data).toBeUndefined();
  });

  test('should return success wuth data when API call succeeds', async () => {
    const mockSummaryData = {
      totalHeroes: 15,
      strongestHero: {
        id: '1',
        name: 'Superman',
      },
      smartestHero: {
        id: '2',
        name: 'Batman',
      },
      heroCount: 18,
      villainCount: 7,
    } as SummaryInformationResponse;

    mockedGetSummaryAction.mockResolvedValue(mockSummaryData);

    const { result } = renderHook(() => useHeroSummary(), {
      wrapper: tanStackCustomProvider(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isError).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isPending).toBe(false);
    expect(mockedGetSummaryAction).toHaveBeenCalled();
  });

  test('should return error state when API call fails', async () => {

    const mockError = new Error('Failed to fetch summary data');
    mockedGetSummaryAction.mockRejectedValue(mockError);

    const { result } = renderHook(() => useHeroSummary(), {
      wrapper: tanStackCustomProvider(),
    });


    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toBe(mockError);


  });
});

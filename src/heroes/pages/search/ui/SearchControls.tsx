import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';

import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  X,
  LayoutGrid,
  LayoutList,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion';

import type { Hero } from '@/heroes/types/hero.interface';

interface Props {
  heroes?: Hero[];
}

const SELECT_CLASS =
  'h-10 w-full cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]';

export const SearchControls = ({ heroes = [] }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [nameInput, setNameInput] = useState(searchParams.get('name') ?? '');
  const [strengthDraft, setStrengthDraft] = useState(
    Number(searchParams.get('strength') ?? '0'),
  );

  const activeAccordion = searchParams.get('active-accordion') ?? '';
  const sort = searchParams.get('sort') ?? '';
  const view = searchParams.get('view') ?? 'grid';

  const setQueryParam = useCallback(
    (name: string, value: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        if (value) {
          next.set(name, value);
        } else {
          next.delete(name);
        }

        return next;
      });
    },
    [setSearchParams],
  );

  const clearSearchParams = useCallback(
    (params: string[]) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        params.forEach((param) => next.delete(param));

        return next;
      });
    },
    [setSearchParams],
  );

  const handleNameChange = (value: string) => {
    setNameInput(value);
  };

  const handleClearName = () => {
    setNameInput('');
    setQueryParam('name', '');
    inputRef.current?.focus();
  };

  const filterOptions = useMemo(() => {
    const teams = new Set<string>();
    const categories = new Set<string>();
    const universes = new Set<string>();
    const statuses = new Set<string>();

    heroes.forEach((hero) => {
      if (hero.team) teams.add(hero.team);
      if (hero.category) categories.add(hero.category);
      if (hero.universe) universes.add(hero.universe);
      if (hero.status) statuses.add(hero.status);
    });

    const toSortedList = (values: Set<string>) =>
      [...values].sort((a, b) => a.localeCompare(b));

    return {
      teams: toSortedList(teams),
      categories: toSortedList(categories),
      universes: toSortedList(universes),
      statuses: toSortedList(statuses),
    };
  }, [heroes]);

  const activeFilterCount = [
    'team',
    'category',
    'universe',
    'status',
  ].filter((key) => searchParams.get(key)).length;

  useEffect(() => {
    const currentName = searchParams.get('name') ?? '';

    if (nameInput === currentName) {
      return;
    }

    const timer = setTimeout(() => {
      setQueryParam('name', nameInput);
    }, 400);

    return () => clearTimeout(timer);
  }, [nameInput, searchParams, setQueryParam]);

  return (
    <>
      <div className='flex flex-col gap-4 mb-8 lg:flex-row'>
        {/* Search */}
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5' />
          <Input
            ref={inputRef}
            type='text'
            placeholder='Search heroes, villains, powers, teams...'
            className='pl-12 h-12 text-lg bg-white pr-10'
            value={nameInput}
            onChange={(event) => handleNameChange(event.target.value)}
            aria-label='Search heroes'
          />
          {nameInput && (
            <button
              type='button'
              aria-label='Clear search'
              onClick={handleClearName}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
            >
              <X className='h-5 w-5 cursor-pointer' />
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div className='flex flex-wrap items-center gap-2'>
          <Button
            variant={
              activeAccordion === 'advanced-filters' ? 'default' : 'outline'
            }
            className='h-12'
            onClick={() =>
              setQueryParam(
                'active-accordion',
                activeAccordion === 'advanced-filters'
                  ? ''
                  : 'advanced-filters',
              )
            }
          >
            <Filter className='h-4 w-4 mr-2' />
            Filters
            {activeFilterCount > 0 && (
              <span className='ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-foreground/20 px-1.5 text-xs'>
                {activeFilterCount}
              </span>
            )}
          </Button>

          <Button
            variant={sort ? 'default' : 'outline'}
            className='h-12'
            onClick={() =>
              setQueryParam('sort', sort === 'name-asc' ? 'name-desc' : 'name-asc')
            }
            aria-pressed={!!sort}
          >
            {sort === 'name-desc' ? (
              <SortDesc className='h-4 w-4 mr-2' />
            ) : (
              <SortAsc className='h-4 w-4 mr-2' />
            )}
            {sort === 'name-desc' ? 'Name (Z-A)' : 'Sort by Name'}
          </Button>

          <Button
            variant='outline'
            className='h-12 px-3'
            onClick={() =>
              setQueryParam('view', view === 'list' ? 'grid' : 'list')
            }
          >
            {view === 'list' ? (
              <LayoutGrid className='h-4 w-4' />
            ) : (
              <LayoutList className='h-4 w-4' />
            )}
            <span className='sr-only'>
              {view === 'list' ? 'Grid view' : 'List view'}
            </span>
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <Accordion
        type='single'
        collapsible
        value={activeAccordion}
        data-testid='accordion'
      >
        <AccordionItem value='advanced-filters'>
          <AccordionContent>
            <div className='bg-white rounded-lg p-6 mb-8 shadow-sm border'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-lg font-semibold'>Advanced Filters</h3>
                <Button
                  variant='ghost'
                  onClick={() =>
                    clearSearchParams([
                      'team',
                      'category',
                      'universe',
                      'status',
                      'strength',
                      'active-accordion',
                    ])
                  }
                >
                  Clear All
                </Button>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <div className='space-y-2'>
                  <label
                    htmlFor='filter-team'
                    className='text-sm font-medium'
                  >
                    Team
                  </label>
                  <select
                    id='filter-team'
                    className={SELECT_CLASS}
                    value={searchParams.get('team') ?? ''}
                    onChange={(event) => setQueryParam('team', event.target.value)}
                  >
                    <option value=''>All teams</option>
                    {filterOptions.teams.map((team) => (
                      <option key={team} value={team}>
                        {team}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='space-y-2'>
                  <label
                    htmlFor='filter-category'
                    className='text-sm font-medium'
                  >
                    Category
                  </label>
                  <select
                    id='filter-category'
                    className={SELECT_CLASS}
                    value={searchParams.get('category') ?? ''}
                    onChange={(event) =>
                      setQueryParam('category', event.target.value)
                    }
                  >
                    <option value=''>All categories</option>
                    {filterOptions.categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='space-y-2'>
                  <label
                    htmlFor='filter-universe'
                    className='text-sm font-medium'
                  >
                    Universe
                  </label>
                  <select
                    id='filter-universe'
                    className={SELECT_CLASS}
                    value={searchParams.get('universe') ?? ''}
                    onChange={(event) =>
                      setQueryParam('universe', event.target.value)
                    }
                  >
                    <option value=''>All universes</option>
                    {filterOptions.universes.map((universe) => (
                      <option key={universe} value={universe}>
                        {universe}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='space-y-2'>
                  <label
                    htmlFor='filter-status'
                    className='text-sm font-medium'
                  >
                    Status
                  </label>
                  <select
                    id='filter-status'
                    className={SELECT_CLASS}
                    value={searchParams.get('status') ?? ''}
                    onChange={(event) =>
                      setQueryParam('status', event.target.value)
                    }
                  >
                    <option value=''>All statuses</option>
                    {filterOptions.statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='mt-4'>
                <label
                  htmlFor='filter-strength'
                  className='text-sm font-medium mb-2 block'
                >
                  Minimum Strength: {strengthDraft}/10
                </label>
                <Slider
                  id='filter-strength'
                  value={[strengthDraft]}
                  onValueChange={(value) => setStrengthDraft(value[0])}
                  onValueCommit={(value) =>
                    setQueryParam('strength', value[0] === 0 ? '' : String(value[0]))
                  }
                  max={10}
                  step={1}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useSearchParams } from 'react-router';

interface Props {
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
}

interface PageItem {
  type: 'page' | 'ellipsis';
  page?: number;
  key: string;
}

const getPageItems = (totalPages: number, currentPage: number): PageItem[] => {
  const items: PageItem[] = [];
  const addPage = (page: number) => {
    const last = items[items.length - 1];
    if (last?.type === 'page' && last.page === page) return;
    items.push({ type: 'page', page, key: `page-${page}` });
  };

  if (totalPages <= 7) {
    for (let page = 1; page <= totalPages; page++) addPage(page);
    return items;
  }

  addPage(1);

  const windowStart = Math.max(2, currentPage - 1);
  const windowEnd = Math.min(totalPages - 1, currentPage + 1);

  if (windowStart > 2) {
    items.push({ type: 'ellipsis', key: 'ellipsis-left' });
  }

  for (let page = windowStart; page <= windowEnd; page++) addPage(page);

  if (windowEnd < totalPages - 1) {
    items.push({ type: 'ellipsis', key: 'ellipsis-right' });
  }

  addPage(totalPages);

  return items;
};

export const CustomPagination = ({ totalPages, totalItems, pageSize }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryPage = searchParams.get('page') ?? '1';
  const page = isNaN(+queryPage) ? 1 : +queryPage;

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return;

    searchParams.set('page', nextPage.toString());

    setSearchParams(searchParams);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageItems = getPageItems(totalPages, page);

  const fromItem =
    totalItems && pageSize ? (page - 1) * pageSize + 1 : undefined;
  const toItem =
    totalItems && pageSize ? Math.min(page * pageSize, totalItems) : undefined;

  return (
    <div className='mb-8 flex flex-col items-center gap-3'>
      <div className='flex flex-wrap items-center justify-center gap-1'>
        <Button
          variant='outline'
          size='sm'
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
          aria-label='Previous page'
        >
          <ChevronLeft className='h-4 w-4' />
          <span className='sr-only sm:not-sr-only'>Previous</span>
        </Button>

        {pageItems.map((item) =>
          item.type === 'ellipsis' ? (
            <span
              key={item.key}
              className='flex h-8 w-8 items-center justify-center text-sm text-muted-foreground'
              aria-hidden='true'
            >
              &hellip;
            </span>
          ) : (
            <Button
              variant={page === item.page ? 'default' : 'outline'}
              size='sm'
              key={item.key}
              onClick={() => handlePageChange(item.page as number)}
              aria-current={page === item.page ? 'page' : undefined}
              aria-label={`Page ${item.page}`}
            >
              {item.page}
            </Button>
          ),
        )}

        <Button
          variant='outline'
          size='sm'
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
          aria-label='Next page'
        >
          <span className='sr-only sm:not-sr-only'>Next</span>
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>

      {fromItem !== undefined && toItem !== undefined && totalItems && (
        <p className='text-sm text-muted-foreground'>
          Showing {fromItem}-{toItem} of {totalItems}
        </p>
      )}
    </div>
  );
};
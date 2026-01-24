import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

interface Props {
  totalPages?: number;
}

export const CustomPagination = ({ totalPages }: Props) => {
  const page = 8 as number; // Current page (hardcoded for now)

  return (
    <div className='flex items-center justify-center space-x-2'>
      <Button variant='outline' size='sm' disabled={page === 1}>
        <ChevronLeft className='h-4 w-4' />
        Previous
      </Button>

      {Array.from({ length: totalPages ?? 0 }).map((_, index) => (
        <Button variant={page === index + 1 ? 'default' : 'outline'} size='sm' key={index}>
          {index + 1}
        </Button>
      ))}

      {/* <Button variant='outline' size='sm'>
        3
      </Button> */}
      {/* <Button variant='ghost' size='sm' disabled>
        <MoreHorizontal className='h-4 w-4' />
      </Button> */}

      <Button variant='outline' size='sm' disabled={page === totalPages}>
        Next
        <ChevronRight className='h-4 w-4' />
      </Button>
    </div>
  );
};

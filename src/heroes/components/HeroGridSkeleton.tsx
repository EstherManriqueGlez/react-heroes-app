import { Skeleton } from '@/components/ui/skeleton';

export const HeroGridSkeleton = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8'>
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className='space-y-3 rounded-xl border bg-white p-4'
        >
          <Skeleton className='h-56 w-full rounded-lg' />
          <Skeleton className='h-6 w-3/4' />
          <Skeleton className='h-4 w-1/2' />
          <Skeleton className='h-20 w-full' />
        </div>
      ))}
    </div>
  );
};
import { Skeleton } from '@/components/ui/skeleton';

export const HeroStatsSkeleton = () => {
  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className='h-32 rounded-xl' />
      ))}
    </div>
  );
};
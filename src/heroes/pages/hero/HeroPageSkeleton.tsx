import { Skeleton } from '@/components/ui/skeleton';

export const HeroPageSkeleton = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header Banner Skeleton */}
      <div className='bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 px-6 py-12'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex flex-col md:flex-row items-center gap-8'>
            <Skeleton className='h-[200px] w-[200px] rounded-full bg-white/10' />
            <div className='flex-1 space-y-4 text-center md:text-left w-full'>
              <Skeleton className='h-6 w-64 mx-auto md:mx-0 bg-white/10' />
              <Skeleton className='h-10 w-72 mx-auto md:mx-0 bg-white/10' />
              <Skeleton className='h-5 w-48 mx-auto md:mx-0 bg-white/10' />
              <Skeleton className='h-20 w-full max-w-2xl bg-white/10' />
            </div>
            <Skeleton className='h-32 w-40 rounded-lg bg-white/10' />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className='max-w-7xl mx-auto px-6 py-8 space-y-6'>
        <Skeleton className='h-10 w-full max-w-md' />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className='h-40 rounded-xl' />
          ))}
        </div>
      </div>
    </div>
  );
};
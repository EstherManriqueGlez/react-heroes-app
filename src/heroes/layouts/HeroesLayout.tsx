import { CustomMenu } from '@/components/custom/CustomMenu';
import { Outlet } from 'react-router';

export const HeroesLayout = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50'>
      <CustomMenu />
      <main className='mx-auto max-w-7xl px-5 pb-12'>
        <Outlet />
      </main>
    </div>
  );
};
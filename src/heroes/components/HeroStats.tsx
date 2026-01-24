import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Heart, Zap, Trophy } from 'lucide-react';

export const HeroStats = () => {
  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Total Characters
          </CardTitle>
          <Users className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>16</div>
          <div className='flex gap-1 mt-2'>
            <Badge variant='secondary' className='text-xs'>
              12 Heroes
            </Badge>
            <Badge variant='destructive' className='text-xs'>
              2 Villains
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Favorites</CardTitle>
          <Heart className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-red-600'>3</div>
          <p className='text-xs text-muted-foreground'>18.8% of total</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Strongest</CardTitle>
          <Zap className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-lg font-bold'>Superman</div>
          <p className='text-xs text-muted-foreground'>Strength: 10/10</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Smartest</CardTitle>
          <Trophy className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-lg font-bold'>Batman</div>
          <p className='text-xs text-muted-foreground'>Intelligence: 10/10</p>
        </CardContent>
      </Card>
    </div>
  );
};

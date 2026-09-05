import { use } from 'react';
import { Navigate, useParams } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import {
  Shield,
  Zap,
  Brain,
  Gauge,
  Users,
  Star,
  Award,
  Heart,
} from 'lucide-react';
import { getHeroAction } from '@/heroes/actions/get-hero.action';
import { FavoriteHeroContext } from '@/heroes/context/FavoriteHeroContext';
import { CustomBreadcrumbs } from '@/components/custom/CustomBreadcrumbs';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { HeroPageSkeleton } from './HeroPageSkeleton';

export const HeroPage = () => {
  const { idSlug = '' } = useParams();
  const { isFavorite, toggleFavorite } = use(FavoriteHeroContext);

  const { data: superheroData, isError } = useQuery({
    queryKey: ['heroes', idSlug],
    queryFn: () => getHeroAction(idSlug),
    retry: false,
  });

  useDocumentTitle(superheroData?.alias ?? 'Hero');

  if (isError) {
    return <Navigate to='/' />;
  }

  if (!superheroData) {
    return <HeroPageSkeleton />;
  }

  const isFavoriteHero = isFavorite(superheroData);

  const totalPower =
    superheroData.strength +
    superheroData.intelligence +
    superheroData.speed +
    superheroData.durability;
  const averagePower = Math.round((totalPower / 4) * 10);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'activo':
      case 'active':
        return 'bg-green-500';
      case 'inactivo':
      case 'inactive':
        return 'bg-gray-500';
      case 'retirado':
      case 'retired':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'héroe':
      case 'hero':
        return 'bg-blue-500';
      case 'villano':
      case 'villain':
        return 'bg-red-500';
      case 'antihéroe':
      case 'antihero':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const statCards = [
    {
      label: 'Strength',
      value: superheroData.strength,
      icon: Zap,
      iconClass: 'bg-red-100 text-red-600',
      valueClass: 'text-red-600',
    },
    {
      label: 'Intelligence',
      value: superheroData.intelligence,
      icon: Brain,
      iconClass: 'bg-purple-100 text-purple-600',
      valueClass: 'text-purple-600',
    },
    {
      label: 'Speed',
      value: superheroData.speed,
      icon: Gauge,
      iconClass: 'bg-yellow-100 text-yellow-600',
      valueClass: 'text-yellow-600',
    },
    {
      label: 'Durability',
      value: superheroData.durability,
      icon: Shield,
      iconClass: 'bg-green-100 text-green-600',
      valueClass: 'text-green-600',
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header Banner */}
      <div className='bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white'>
        <div className='mx-auto max-w-7xl px-6 py-12'>
          <div className='flex flex-col items-center gap-8 md:flex-row'>
            <div className='relative'>
              <img
                src={superheroData.image || '/placeholder.svg'}
                alt={superheroData.alias}
                width={200}
                height={200}
                className='rounded-full border-4 border-white/20 shadow-2xl'
              />
              <div className='absolute -right-2 -top-2'>
                <div className='rounded-full bg-yellow-400 p-2 text-black'>
                  <Star className='h-6 w-6' />
                </div>
              </div>
            </div>

            <div className='flex-1 text-center md:text-left'>
              <div className='mb-4 flex flex-wrap justify-center gap-2 md:justify-start'>
                <Badge
                  className={`${getCategoryColor(superheroData.category)} text-white`}
                >
                  {superheroData.category}
                </Badge>
                <Badge
                  className={`${getStatusColor(superheroData.status)} text-white`}
                >
                  {superheroData.status}
                </Badge>
                <Badge
                  variant='secondary'
                  className='border-white/30 bg-white/20 text-white'
                >
                  {superheroData.universe}
                </Badge>
              </div>

              <h1 className='mb-2 text-4xl font-bold md:text-6xl'>
                {superheroData.alias}
              </h1>
              <p className='mb-4 text-xl text-blue-200'>{superheroData.name}</p>
              <p className='max-w-2xl text-lg text-gray-300'>
                {superheroData.description}
              </p>
            </div>

            <div className='space-y-3 text-center'>
              <div className='rounded-lg bg-white/10 p-6 backdrop-blur-sm'>
                <div className='text-3xl font-bold text-yellow-400'>
                  {averagePower}%
                </div>
                <div className='text-sm text-gray-300'>Power Level</div>
                <div className='mt-2 flex justify-center'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(averagePower / 20) ? 'fill-current text-yellow-400' : 'text-gray-400'}`}
                    />
                  ))}
                </div>
              </div>
              <Button
                variant={isFavoriteHero ? 'secondary' : 'outline'}
                className='border-white/30 bg-white/10 text-white hover:bg-white/20'
                onClick={() => toggleFavorite(superheroData)}
                aria-pressed={isFavoriteHero}
              >
                <Heart
                  className={`h-4 w-4 ${isFavoriteHero ? 'fill-red-500 text-red-500' : 'text-white'}`}
                />
                {isFavoriteHero ? 'In Favorites' : 'Add to Favorites'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='mx-auto max-w-7xl px-6 py-8'>
        <CustomBreadcrumbs currentPage={superheroData.alias} />

        <Tabs defaultValue='stats' className='w-full'>
          <TabsList className='mb-8 grid w-full grid-cols-2 md:grid-cols-4'>
            <TabsTrigger value='stats' className='flex items-center gap-2'>
              <Gauge className='h-4 w-4' />
              Stats
            </TabsTrigger>
            <TabsTrigger value='powers' className='flex items-center gap-2'>
              <Zap className='h-4 w-4' />
              Powers
            </TabsTrigger>
            <TabsTrigger value='team' className='flex items-center gap-2'>
              <Users className='h-4 w-4' />
              Team
            </TabsTrigger>
            <TabsTrigger value='info' className='flex items-center gap-2'>
              <Award className='h-4 w-4' />
              Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value='stats' className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
              {statCards.map((stat) => {
                const Icon = stat.icon;

                return (
                  <Card key={stat.label} className='text-center'>
                    <CardContent className='pt-6'>
                      <div className='mb-4 flex justify-center'>
                        <div className={`rounded-full p-3 ${stat.iconClass}`}>
                          <Icon className='h-8 w-8' />
                        </div>
                      </div>
                      <h3 className='mb-2 text-lg font-semibold'>
                        {stat.label}
                      </h3>
                      <div
                        className={`mb-2 text-3xl font-bold ${stat.valueClass}`}
                      >
                        {stat.value}
                      </div>
                      <Progress value={stat.value * 10} className='h-2' />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value='powers'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Zap className='h-6 w-6 text-yellow-500' />
                  Superpowers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                  {superheroData.powers.map((power, index) => (
                    <div
                      key={`${power}-${index}`}
                      className='rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4'
                    >
                      <div className='flex items-center gap-3'>
                        <div className='rounded-full bg-blue-500 p-2'>
                          <Zap className='h-4 w-4 text-white' />
                        </div>
                        <span className='font-medium text-blue-900'>
                          {power}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='team'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Users className='h-6 w-6 text-green-500' />
                  Team Affiliation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='py-8 text-center'>
                  <div className='mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 p-6'>
                    <Users className='h-12 w-12 text-green-600' />
                  </div>
                  <h3 className='mb-2 text-2xl font-bold text-green-700'>
                    {superheroData.team}
                  </h3>
                  <Badge
                    className={`${getCategoryColor(superheroData.category)} text-white`}
                  >
                    {superheroData.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='info'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle>Personal Details</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex justify-between items-center border-b py-2'>
                    <span className='text-gray-600'>Real Name:</span>
                    <span className='font-semibold'>{superheroData.name}</span>
                  </div>
                  <div className='flex justify-between items-center border-b py-2'>
                    <span className='text-gray-600'>Alias:</span>
                    <span className='font-semibold'>
                      {superheroData.alias}
                    </span>
                  </div>
                  <div className='flex justify-between items-center border-b py-2'>
                    <span className='text-gray-600'>Category:</span>
                    <Badge
                      className={`${getCategoryColor(superheroData.category)} text-white`}
                    >
                      {superheroData.category}
                    </Badge>
                  </div>
                  <div className='flex justify-between items-center py-2'>
                    <span className='text-gray-600'>Status:</span>
                    <Badge
                      className={`${getStatusColor(superheroData.status)} text-white`}
                    >
                      {superheroData.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Universe Information</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex justify-between items-center border-b py-2'>
                    <span className='text-gray-600'>Universe:</span>
                    <span className='font-semibold'>
                      {superheroData.universe}
                    </span>
                  </div>
                  <div className='flex justify-between items-center border-b py-2'>
                    <span className='text-gray-600'>First Appearance:</span>
                    <span className='font-semibold'>
                      {superheroData.firstAppearance}
                    </span>
                  </div>
                  <div className='flex justify-between items-center border-b py-2'>
                    <span className='text-gray-600'>Years Active:</span>
                    <span className='font-semibold'>
                      {new Date().getFullYear() -
                        Number.parseInt(superheroData.firstAppearance)}{' '}
                      years
                    </span>
                  </div>
                  <div className='flex justify-between items-center py-2'>
                    <span className='text-gray-600'>Team:</span>
                    <span className='font-semibold'>
                      {superheroData.team}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
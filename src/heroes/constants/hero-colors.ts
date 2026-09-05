const CATEGORY_COLORS: Record<string, string> = {
  'héroe': 'bg-blue-500',
  'hero': 'bg-blue-500',
  'villano': 'bg-red-500',
  'villain': 'bg-red-500',
  'antihéroe': 'bg-purple-500',
  'antihero': 'bg-purple-500',
};

const STATUS_COLORS: Record<string, string> = {
  'activo': 'bg-green-500',
  'active': 'bg-green-500',
  'inactivo': 'bg-gray-500',
  'inactive': 'bg-gray-500',
  'retirado': 'bg-blue-500',
  'retired': 'bg-blue-500',
};

const FALLBACK_COLOR = 'bg-gray-500';

export const getCategoryColor = (category: string) =>
  CATEGORY_COLORS[category.toLowerCase()] ?? FALLBACK_COLOR;

export const getStatusColor = (status: string) =>
  STATUS_COLORS[status.toLowerCase()] ?? FALLBACK_COLOR;
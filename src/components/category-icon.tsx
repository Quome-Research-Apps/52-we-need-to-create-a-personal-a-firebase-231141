import React from 'react';
import { CATEGORIES } from '@/lib/config';
import { MoreHorizontal } from 'lucide-react';

type CategoryIconProps = {
  category: string;
  className?: string;
};

export function CategoryIcon({ category, className }: CategoryIconProps) {
  const categoryConfig = CATEGORIES.find(c => c.value === category);
  const Icon = categoryConfig ? categoryConfig.icon : MoreHorizontal;
  return <Icon className={cn('h-4 w-4', className)} />;
}

function cn(arg0: string, className: string | undefined): string | undefined {
    return [arg0, className].filter(Boolean).join(' ');
}

import {
  ShoppingCart,
  Car,
  Film,
  Home,
  HeartPulse,
  FileText,
  UtensilsCrossed,
  Tv,
  Gift,
  MoreHorizontal,
} from 'lucide-react';
import type { Category } from '@/types';

export const CATEGORIES: Category[] = [
  { value: 'groceries', label: 'Groceries', icon: ShoppingCart },
  { value: 'transportation', label: 'Transportation', icon: Car },
  { value: 'entertainment', label: 'Entertainment', icon: Film },
  { value: 'rent-mortgage', label: 'Rent/Mortgage', icon: Home },
  { value: 'health', label: 'Health', icon: HeartPulse },
  { value: 'utilities', label: 'Utilities', icon: FileText },
  { value: 'dining-out', label: 'Dining Out', icon: UtensilsCrossed },
  { value: 'subscriptions', label: 'Subscriptions', icon: Tv },
  { value: 'gifts', label: 'Gifts', icon: Gift },
  { value: 'other', label: 'Other', icon: MoreHorizontal },
];

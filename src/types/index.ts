export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO string for date
}

export type Category = {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

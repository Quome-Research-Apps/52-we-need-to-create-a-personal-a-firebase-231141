'use client';

import React, { useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Expense } from '@/types';
import { CATEGORIES } from '@/lib/config';

type OverviewChartsProps = {
  expenses: Expense[];
};

export function OverviewCharts({ expenses }: OverviewChartsProps) {
  const spendingByCategory = useMemo(() => {
    const categoryMap: { [key: string]: number } = {};

    expenses.forEach(expense => {
      if (categoryMap[expense.category]) {
        categoryMap[expense.category] += expense.amount;
      } else {
        categoryMap[expense.category] = expense.amount;
      }
    });
    
    const allCategoryLabels = CATEGORIES.reduce((acc, cat) => {
        acc[cat.value] = cat.label;
        return acc;
    }, {} as {[key: string]: string});


    return Object.entries(categoryMap)
      .map(([category, total]) => ({
        name: allCategoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1),
        total: total,
      }))
      .sort((a, b) => b.total - a.total);
  }, [expenses]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='font-headline'>Spending by Category</CardTitle>
        <CardDescription>A look at where your money is going.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        {expenses.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={spendingByCategory}>
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--accent))' }}
                contentStyle={{ 
                    background: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))', 
                    borderRadius: 'var(--radius)' 
                }}
              />
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
            <div className="flex h-[350px] w-full items-center justify-center">
                <p className="text-muted-foreground">No data to display. Start logging expenses!</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}

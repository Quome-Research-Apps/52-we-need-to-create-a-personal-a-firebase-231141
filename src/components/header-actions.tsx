'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Sparkles } from 'lucide-react';
import { BudgetSuggester } from '@/components/budget-suggester';
import { DataExporter } from '@/components/data-exporter';
import type { Expense } from '@/types';

type HeaderActionsProps = {
  expenses: Expense[];
};

export function HeaderActions({ expenses }: HeaderActionsProps) {
  const [isSuggesterOpen, setIsSuggesterOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">More actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setIsSuggesterOpen(true)}>
            <Sparkles className="mr-2 h-4 w-4" />
            <span>AI Budget Helper</span>
          </DropdownMenuItem>
          <DataExporter expenses={expenses} />
        </DropdownMenuContent>
      </DropdownMenu>
      <BudgetSuggester
        expenses={expenses}
        isOpen={isSuggesterOpen}
        setIsOpen={setIsSuggesterOpen}
      />
    </>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import type { Expense } from '@/types';
import { CategoryIcon } from './category-icon';
import { CATEGORIES } from '@/lib/config';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


type ExpenseTableProps = {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  userCategories: string[];
};

export function ExpenseTable({ expenses, onEdit, onDelete, userCategories }: ExpenseTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  
  const allCategories = useMemo(() => {
    const defaultCategories = CATEGORIES.map(c => ({ value: c.value, label: c.label }));
    const customCategoryObjects = userCategories
      .filter(uc => !CATEGORIES.some(dc => dc.value === uc))
      .map(uc => ({ value: uc, label: uc.charAt(0).toUpperCase() + uc.slice(1) }));
    return [...defaultCategories, ...customCategoryObjects];
  }, [userCategories]);

  const getCategoryLabel = (value: string) => {
    const category = allCategories.find(c => c.value === value);
    return category ? category.label : value;
  };

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter(expense =>
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCategoryLabel(expense.category).toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.amount.toString().includes(searchTerm)
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, searchTerm, allCategories]);

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="p-4 border-b">
        <h3 className="font-semibold tracking-tight text-lg font-headline">Recent Transactions</h3>
         <div className="mt-4">
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>
      <div className="relative">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    <Badge variant="secondary" className="whitespace-nowrap">
                       <CategoryIcon category={expense.category} className="mr-2" />
                       {getCategoryLabel(expense.category)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{expense.description || '-'}</TableCell>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    {expense.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(expense)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onSelect={() => setDeleteConfirmation(expense.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No expenses logged yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <AlertDialog open={deleteConfirmation !== null} onOpenChange={(open) => !open && setDeleteConfirmation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this expense from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => {
                if(deleteConfirmation) onDelete(deleteConfirmation);
                setDeleteConfirmation(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

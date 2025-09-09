'use client';

import { useState, useMemo } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import type { Expense } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, Wallet } from 'lucide-react';
import { ExpenseTable } from '@/components/expense-table';
import { OverviewCharts } from '@/components/overview-charts';
import { AddExpenseDialog } from '@/components/add-expense-dialog';
import { HeaderActions } from '@/components/header-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PocketLedgerApp() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [userCategories, setUserCategories] = useLocalStorage<string[]>('user_categories', []);

  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    setExpenses([...expenses, { ...expense, id: new Date().toISOString() + Math.random() }]);
    if (!userCategories.includes(expense.category)) {
      setUserCategories([...userCategories, expense.category]);
    }
  };

  const handleUpdateExpense = (updatedExpense: Expense) => {
    setExpenses(
      expenses.map((e) => (e.id === updatedExpense.id ? updatedExpense : e))
    );
    if (!userCategories.includes(updatedExpense.category)) {
      setUserCategories([...userCategories, updatedExpense.category]);
    }
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const openAddDialog = () => {
    setEditingExpense(null);
    setDialogOpen(true);
  };

  const openEditDialog = (expense: Expense) => {
    setEditingExpense(expense);
    setDialogOpen(true);
  };

  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);
  
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
        <div className="flex items-center gap-2">
            <Wallet className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold text-primary font-headline">
                PocketLedger
            </h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button onClick={openAddDialog}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
          </Button>
          <HeaderActions expenses={expenses} />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <span className="text-muted-foreground">$</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">
                {totalSpent.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </div>
              <p className="text-xs text-muted-foreground">
                Across {expenses.length} transactions
              </p>
            </CardContent>
          </Card>
        </div>
        <OverviewCharts expenses={expenses} />
        <ExpenseTable
          expenses={expenses}
          onEdit={openEditDialog}
          onDelete={handleDeleteExpense}
          userCategories={userCategories}
        />
      </main>
      <AddExpenseDialog
        isOpen={dialogOpen}
        setIsOpen={setDialogOpen}
        onAddExpense={handleAddExpense}
        onUpdateExpense={handleUpdateExpense}
        expenseToEdit={editingExpense}
        userCategories={userCategories}
      />
    </div>
  );
}

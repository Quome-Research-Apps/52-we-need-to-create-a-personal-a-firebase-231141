'use client';

import { useState } from 'react';
import { suggestBudget, type SuggestBudgetOutput } from '@/ai/flows/budget-suggestions';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from 'lucide-react';
import type { Expense } from '@/types';

type BudgetSuggesterProps = {
  expenses: Expense[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export function BudgetSuggester({ expenses, isOpen, setIsOpen }: BudgetSuggesterProps) {
  const [financialGoals, setFinancialGoals] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestBudgetOutput | null>(null);
  const { toast } = useToast();

  const handleGetSuggestion = async () => {
    if (!financialGoals.trim()) {
      toast({
        variant: 'destructive',
        title: 'Financial goals are required.',
        description: 'Please tell us what you are saving for.',
      });
      return;
    }

    setIsLoading(true);
    setSuggestion(null);

    try {
      const transactions = expenses.map(e => ({
        amount: e.amount,
        category: e.category,
        description: e.description,
        date: e.date,
      }));

      const result = await suggestBudget({ financialGoals, transactions });
      setSuggestion(result);
    } catch (error) {
      console.error('AI suggestion failed:', error);
      toast({
        variant: 'destructive',
        title: 'Suggestion Failed',
        description: 'Could not generate a budget suggestion at this time.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetAndClose = () => {
    setFinancialGoals('');
    setSuggestion(null);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Budget Helper
          </DialogTitle>
          <DialogDescription>
            Get a personalized budget suggestion based on your spending and goals.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {!suggestion ? (
             <div className="grid w-full gap-2">
              <Label htmlFor="financial-goals">Your Financial Goals</Label>
              <Textarea
                id="financial-goals"
                placeholder="e.g., Save for a down payment, pay off debt, build an emergency fund..."
                value={financialGoals}
                onChange={(e) => setFinancialGoals(e.target.value)}
                rows={4}
              />
            </div>
          ) : (
            <div className="space-y-4 text-sm">
                <h3 className="font-semibold text-lg font-headline">Your Personalized Budget</h3>
                <p className='text-muted-foreground'>{suggestion.reasoning}</p>
                <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                    <div>
                        <p className="text-muted-foreground">Weekly Budget</p>
                        <p className="text-2xl font-bold text-primary font-headline">
                            {suggestion.weeklyBudget.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Monthly Budget</p>
                        <p className="text-2xl font-bold text-primary font-headline">
                             {suggestion.monthlyBudget.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                    </div>
                </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={resetAndClose}>
            {suggestion ? 'Close' : 'Cancel'}
          </Button>
          {!suggestion && (
            <Button onClick={handleGetSuggestion} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Get Suggestion
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import React, { useEffect, useState, useMemo } from 'react';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Expense } from "@/types";
import { CATEGORIES } from "@/lib/config";

const formSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  date: z.date(),
});

type AddExpenseDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onUpdateExpense: (expense: Expense) => void;
  expenseToEdit: Expense | null;
  userCategories: string[];
};

export function AddExpenseDialog({ isOpen, setIsOpen, onAddExpense, onUpdateExpense, expenseToEdit, userCategories }: AddExpenseDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      category: "",
      description: "",
      date: new Date(),
    },
  });

  useEffect(() => {
    if (expenseToEdit) {
      form.reset({
        amount: expenseToEdit.amount,
        category: expenseToEdit.category,
        description: expenseToEdit.description,
        date: new Date(expenseToEdit.date),
      });
    } else {
      form.reset({
        amount: 0,
        category: "",
        description: "",
        date: new Date(),
      });
    }
  }, [expenseToEdit, isOpen, form]);
  
  const combinedCategories = useMemo(() => {
    const defaultCategories = CATEGORIES.map(c => c.value);
    const allCategories = [...new Set([...defaultCategories, ...userCategories])];
    return allCategories.map(c => {
      const existing = CATEGORIES.find(ec => ec.value === c);
      return { value: c, label: existing?.label || c.charAt(0).toUpperCase() + c.slice(1) };
    });
  }, [userCategories]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const expenseData = { ...values, date: values.date.toISOString() };

    if (expenseToEdit) {
      onUpdateExpense({ ...expenseToEdit, ...expenseData });
    } else {
      onAddExpense(expenseData);
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setIsSubmitting(false);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{expenseToEdit ? "Edit Expense" : "Add Expense"}</DialogTitle>
          <DialogDescription>
            {expenseToEdit ? "Update the details of your expense." : "Log a new expense to track your spending."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {combinedCategories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Weekly grocery run" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {expenseToEdit ? 'Save Changes' : 'Add Expense'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

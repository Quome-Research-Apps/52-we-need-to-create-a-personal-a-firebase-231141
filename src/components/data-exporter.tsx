'use client';

import { Download } from 'lucide-react';
import { exportToCSV, exportToJSON } from '@/lib/utils';
import type { Expense } from '@/types';
import {
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

type DataExporterProps = {
  expenses: Expense[];
};

export function DataExporter({ expenses }: DataExporterProps) {
  return (
    <>
      <DropdownMenuItem onSelect={() => exportToJSON(expenses)}>
        <Download className="mr-2 h-4 w-4" />
        <span>Export as JSON</span>
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={() => exportToCSV(expenses)}>
        <Download className="mr-2 h-4 w-4" />
        <span>Export as CSV</span>
      </DropdownMenuItem>
    </>
  );
}

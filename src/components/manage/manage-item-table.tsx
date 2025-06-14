
"use client";

import type { Item } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ItemActionsDropdown } from './item-actions-dropdown';
import { cn } from '@/lib/utils';

interface ManageItemTableProps {
  items: Item[];
  onEditItem: (item: Item) => void;
  onDeleteItem: (item: Item) => void;
  itemOffset: number;
  className?: string; // Added className prop
}

export function ManageItemTable({ items, onEditItem, onDeleteItem, itemOffset, className }: ManageItemTableProps) {
  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
    return `Rp. ${formatted}`;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
    } catch (e) {
      return 'N/A';
    }
  };

  return (
    // Removed explicit style height, using cn to merge default and passed classNames
    <ScrollArea className={cn("rounded-lg border bg-card shadow", className)}>
      <Table>
        <TableHeader className="sticky top-0 bg-card z-10">
          <TableRow>
            <TableHead className="w-[50px] text-center">No</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead className="w-[100px]">Code</TableHead>
            <TableHead className="w-[120px]">ID No.</TableHead>
            <TableHead className="text-right w-[180px]">Price</TableHead>
            <TableHead className="text-right w-[100px]">QTY</TableHead>
            <TableHead className="text-center w-[120px]">Modified</TableHead>
            <TableHead className="text-center w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                No items found.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item, index) => (
              <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="text-center font-medium">{itemOffset + index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.id}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                <TableCell className="text-right">{item.stock}</TableCell>
                <TableCell className="text-center">{formatDate(item.modifiedDate)}</TableCell>
                <TableCell className="text-center">
                  <ItemActionsDropdown
                    onEdit={() => onEditItem(item)}
                    onDelete={() => onDeleteItem(item)}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}

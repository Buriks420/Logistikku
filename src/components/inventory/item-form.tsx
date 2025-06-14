"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import type { Item } from '@/lib/types';
import { ITEM_CATEGORIES, ItemCategory } from '@/lib/constants';
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ScrollArea } from '../ui/scroll-area';

const itemSchema = z.object({
  code: z.string().min(1, "Code is required").max(50),
  name: z.string().min(1, "Name is required").max(100),
  category: z.enum(ITEM_CATEGORIES, { errorMap: () => ({ message: "Category is required" }) }),
  stock: z.coerce.number().min(0, "Stock must be non-negative"),
  price: z.coerce.number().min(0.01, "Price must be positive"),
  minStock: z.coerce.number().min(0, "Minimum stock must be non-negative"),
});

type ItemFormData = z.infer<typeof itemSchema>;

interface ItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ItemFormData | (ItemFormData & { id: string })) => void;
  initialData?: Item | null;
}

export function ItemForm({ isOpen, onClose, onSubmit, initialData }: ItemFormProps) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      code: '',
      name: '',
      category: undefined,
      stock: 0,
      price: 0,
      minStock: 0,
    }
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        code: '',
        name: '',
        category: undefined,
        stock: 0,
        price: 0,
        minStock: 0,
      });
    }
  }, [initialData, reset, isOpen]);


  const handleFormSubmit: SubmitHandler<ItemFormData> = (data) => {
    if (initialData) {
      onSubmit({ ...data, id: initialData.id });
    } else {
      onSubmit(data);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] md:sm:max-w-[600px]">
      <ScrollArea className="max-h-[80vh] p-1">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary">
            {initialData ? 'Edit Item' : 'Add New Item'}
          </DialogTitle>
          <DialogDescription>
            {initialData ? 'Update the details of the existing item.' : 'Fill in the details to add a new item to the inventory.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4 py-4 px-6">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">Code</Label>
            <Controller
              name="code"
              control={control}
              render={({ field }) => <Input id="code" {...field} className="col-span-3 bg-input" />}
            />
            {errors.code && <p className="col-span-4 text-right text-sm text-destructive">{errors.code.message}</p>}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input id="name" {...field} className="col-span-3 bg-input" />}
            />
            {errors.name && <p className="col-span-4 text-right text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <SelectTrigger id="category" className="col-span-3 bg-input">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {ITEM_CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && <p className="col-span-4 text-right text-sm text-destructive">{errors.category.message}</p>}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right">Stock</Label>
            <Controller
              name="stock"
              control={control}
              render={({ field }) => <Input id="stock" type="number" {...field} className="col-span-3 bg-input" />}
            />
            {errors.stock && <p className="col-span-4 text-right text-sm text-destructive">{errors.stock.message}</p>}
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="minStock" className="text-right">Min. Stock</Label>
            <Controller
              name="minStock"
              control={control}
              render={({ field }) => <Input id="minStock" type="number" {...field} className="col-span-3 bg-input" />}
            />
            {errors.minStock && <p className="col-span-4 text-right text-sm text-destructive">{errors.minStock.message}</p>}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">Price</Label>
            <Controller
              name="price"
              control={control}
              render={({ field }) => <Input id="price" type="number" step="0.01" {...field} className="col-span-3 bg-input" />}
            />
            {errors.price && <p className="col-span-4 text-right text-sm text-destructive">{errors.price.message}</p>}
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {initialData ? 'Save Changes' : 'Add Item'}
            </Button>
          </DialogFooter>
        </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

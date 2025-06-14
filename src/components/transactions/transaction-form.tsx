"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Item } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { X, Loader2 } from 'lucide-react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define the validation rules for our form
const transactionSchema = z.object({
  customerName: z.string().min(1, { message: "Customer name cannot be empty." }),
  invoiceId: z.string().min(1, { message: "Invoice ID cannot be empty." }),
  items: z.array(z.object({
      id: z.any(),
      quantity: z.number().min(1)
  })).min(1, { message: "You must add at least one item to the cart." })
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface CartItem extends Item {
  quantity: number;
}

export function TransactionForm({ isOpen, onClose, onSuccess }: TransactionFormProps) {
  const { toast } = useToast();
  const [availableItems, setAvailableItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      customerName: '',
      invoiceId: '',
      items: [],
    }
  });

  const cart = watch('items');

  // **FIX #2 IS HERE**
  const totalPrice = useMemo(() => {
    return cart.reduce((total, cartItem) => {
        const itemDetails = availableItems.find(i => i.id.toString() === cartItem.id.toString());
        return total + ((itemDetails?.price || 0) * cartItem.quantity);
    }, 0);
  }, [cart, availableItems]); // Corrected dependency array


  useEffect(() => {
    if (isOpen) {
      const fetchItems = async () => {
        const response = await fetch('/api/items');
        const data = await response.json();
        setAvailableItems(data);
      };
      fetchItems();

      // --- START OF CHANGE ---
      // Logic to generate the new Invoice ID format
      const year = new Date().getFullYear();
      const characters = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789';
      let randomPart = '';
      for (let i = 0; i < 12; i++) {
        randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      const newInvoiceId = `${year}-${randomPart}`;
      // --- END OF CHANGE ---

      reset({
        customerName: '',
        invoiceId: newInvoiceId, // Use the newly generated ID
        items: []
      });
    }
  }, [isOpen, reset]);

  const handleAddItemToCart = (itemId: string) => {
    const currentCart = watch('items');
    const itemToAdd = availableItems.find(i => i.id.toString() === itemId);

    if (!itemToAdd || currentCart.some(i => i.id === itemToAdd.id)) return;

    if (itemToAdd.stock > 0) {
      setValue('items', [...currentCart, { id: itemToAdd.id, quantity: 1 }], { shouldValidate: true });
    } else {
      toast({ variant: "destructive", title: "Out of Stock", description: `${itemToAdd.name} is currently out of stock.` });
    }
  };

  const handleQuantityChange = (itemId: any, quantity: number) => {
    const currentCart = watch('items');
    const itemDetails = availableItems.find(i => i.id.toString() === itemId.toString());

    if (itemDetails && quantity > itemDetails.stock) {
      toast({ variant: "destructive", title: "Stock Limit Exceeded", description: `Only ${itemDetails.stock} units of ${itemDetails.name} available.` });
      setValue('items', currentCart.map(i => i.id === itemId ? { ...i, quantity: itemDetails.stock } : i), { shouldValidate: true });
      return;
    }

    const newCart = currentCart.map(i => i.id === itemId ? { ...i, quantity: Math.max(1, quantity) } : i);
    setValue('items', newCart, { shouldValidate: true });
  };

  const handleRemoveFromCart = (itemId: any) => {
    const currentCart = watch('items');
    setValue('items', currentCart.filter(i => i.id !== itemId), { shouldValidate: true });
  };

  const processSubmit: (data: TransactionFormData) => void = async (data) => {
    setIsLoading(true);
    try {
        const fullItemsData = data.items.map(cartItem => {
            const itemDetails = availableItems.find(i => i.id.toString() === cartItem.id.toString());
            return {...itemDetails, ...cartItem};
        });

        const response = await fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, totalPrice, items: fullItemsData }),
        });

        if (!response.ok) throw new Error('Failed to create transaction');

        toast({ title: "Success", description: "Transaction created successfully." });
        onSuccess();
        onClose();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not create transaction." });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>Fill in the details for the new transaction.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(processSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Controller name="customerName" control={control} render={({ field }) => <Input id="customerName" {...field} />} />
                {errors.customerName && <p className="text-sm text-destructive mt-1">{errors.customerName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoiceId">Invoice ID</Label>
                <Controller name="invoiceId" control={control} render={({ field }) => <Input id="invoiceId" {...field} />} />
                {errors.invoiceId && <p className="text-sm text-destructive mt-1">{errors.invoiceId.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Add Item to Cart</Label>
                <Select onValueChange={handleAddItemToCart} value="">
                  <SelectTrigger><SelectValue placeholder="Select an item..." /></SelectTrigger>
                  <SelectContent>
                    {availableItems.map(item => (
                      <SelectItem key={item.id} value={item.id.toString()} disabled={item.stock === 0 || cart.some(c => c.id === item.id)}>
                        {item.name} (Stock: {item.stock})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                 {errors.items && <p className="text-sm text-destructive mt-1">{errors.items.message}</p>}
              </div>
            </div>
            <div className="space-y-4">
              <Label>Cart</Label>
              <div className="rounded-md border max-h-64 overflow-y-auto">
                <Table>
                  <TableHeader><TableRow><TableHead>Item</TableHead><TableHead>QTY</TableHead><TableHead>Price</TableHead><TableHead></TableHead></TableRow></TableHeader>
                  <TableBody>
                    {cart.length === 0 ? (
                      <TableRow><TableCell colSpan={4} className="text-center h-24">Cart is empty</TableCell></TableRow>
                    ) : (
                      cart.map(item => {
                        const itemDetails = availableItems.find(i => i.id === item.id);
                        return (
                          <TableRow key={item.id}>
                            <TableCell>{itemDetails?.name}</TableCell>
                            <TableCell><Input type="number" value={item.quantity} onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))} className="w-16 h-8"/></TableCell>
                            <TableCell>Rp. {((itemDetails?.price || 0) * item.quantity).toLocaleString('id-ID')}</TableCell>
                            <TableCell><Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveFromCart(item.id)}><X className="h-4 w-4"/></Button></TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="text-right text-lg font-bold">Total: Rp. {totalPrice.toLocaleString('id-ID')}</div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Transaction"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
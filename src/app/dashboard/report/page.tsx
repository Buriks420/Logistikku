"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Transaction } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Printer, PlusCircle, Loader2, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { useToast } from "@/hooks/use-toast";
import { DeleteConfirmationDialog } from '@/components/manage/delete-confirmation-dialog';

export default function ReportPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const { toast } = useToast();

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/transactions');
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not load transactions." });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDelete = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
  };

  const confirmDelete = async () => {
    if (!transactionToDelete) return;

    // You can leave this console.log to confirm the fix, or remove it.
    console.log("ATTEMPTING TO DELETE TRANSACTION WITH ID:", transactionToDelete.id);

    try {
      const response = await fetch(`/api/transactions/${transactionToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete transaction');
      toast({ title: "Success", description: "Transaction deleted and stock has been restored." });
      fetchTransactions(); // Refresh the list
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not delete transaction." });
    } finally {
      setTransactionToDelete(null);
    }
  };

  const formatCurrency = (amount: number) => `Rp. ${new Intl.NumberFormat('id-ID').format(amount)}`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-card rounded-lg shadow">
        <h1 className="text-xl font-semibold">Transaction Report</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsFormOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground h-10">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
          <Button variant="outline" onClick={() => window.print()} className="h-10">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
        </div>
      </div>

      <Card className="shadow">
        <ScrollArea className="rounded-lg border bg-card" style={{ height: 'calc(100vh - 200px)', minHeight: '400px' }}>
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead className="w-[250px]">Customer Name</TableHead>
                <TableHead>Invoice ID</TableHead>
                <TableHead className="text-right">Total Price</TableHead>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="h-24 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin"/></TableCell></TableRow>
              ) : transactions.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No transactions found.</TableCell></TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.customerName}</TableCell>
                    <TableCell>{transaction.invoiceId}</TableCell>
                    <TableCell className="text-right">{formatCurrency(transaction.totalPrice)}</TableCell>
                    <TableCell className="text-center">{formatDate(transaction.createDate)}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(transaction)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>

      <TransactionForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSuccess={fetchTransactions} />

      {transactionToDelete && (
         <DeleteConfirmationDialog
            isOpen={!!transactionToDelete}
            onClose={() => setTransactionToDelete(null)}
            onConfirm={confirmDelete}
            itemName={`transaction ${transactionToDelete.invoiceId}`}
         />
      )}
    </div>
  );
}
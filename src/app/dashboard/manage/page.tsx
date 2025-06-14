"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Item } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Printer, PlusCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { ManageItemTable } from '@/components/manage/manage-item-table';
import { ItemForm } from '@/components/inventory/item-form';
import { DeleteConfirmationDialog } from '@/components/manage/delete-confirmation-dialog';
import { useToast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 5;

export default function ManagePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/items');
      if (!response.ok) throw new Error('Failed to fetch items');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not load items from the database." });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);
  const itemOffset = (currentPage - 1) * ITEMS_PER_PAGE;

  const handleAddItem = () => {
    setEditingItem(null);
    setIsItemFormOpen(true);
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setIsItemFormOpen(true);
  };

  const handleDeleteItem = (item: Item) => {
    setItemToDelete(item);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteItem = async () => {
  if (!itemToDelete) return;
  try {
    const response = await fetch(`/api/items/${itemToDelete.id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete item');
    toast({ title: "Item Deleted", description: `"${itemToDelete.name}" has been deleted.` });
    fetchItems(); // Refresh the data
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred.";
    toast({ variant: "destructive", title: "Error", description: message });
  } finally {
    setIsDeleteConfirmOpen(false);
    setItemToDelete(null);
  }
};

  const handleFormSubmit = async (data: any) => {
  try {
    let response;
    if (editingItem) {
      // This is an UPDATE operation
      response = await fetch(`/api/items/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update item');
      toast({ title: "Item Updated", description: `"${data.name}" has been updated successfully.` });
    } else {
      // This is a CREATE operation
      response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to add item');
      toast({ title: "Item Added", description: `"${data.name}" has been added successfully.` });
    }

    fetchItems(); // Refresh the data from the database
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred.";
    toast({ variant: "destructive", title: "Error", description: message });
  } finally {
    setIsItemFormOpen(false);
    setEditingItem(null);
  }
};


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full p-1 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-card rounded-lg shadow">
        <div className="relative w-full sm:w-auto sm:max-w-xs">
          <Input
            type="search"
            placeholder="Find here..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="pl-10 bg-input rounded-lg h-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()} className="h-10">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button onClick={handleAddItem} className="bg-primary hover:bg-primary/90 text-primary-foreground h-10">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </div>
      </div>

      <ManageItemTable
        items={paginatedItems}
        onEditItem={handleEditItem}
        onDeleteItem={handleDeleteItem}
        itemOffset={itemOffset}
        className="flex-1 min-h-0"
      />

      {totalPages > 0 && (
        <div className="flex justify-end items-center p-4 bg-card rounded-lg shadow">
            <Button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} variant="outline" size="icon" className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
            <span className='mx-4 text-sm'>Page {currentPage} of {totalPages}</span>
            <Button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} variant="outline" size="icon" className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
        </div>
      )}

      <ItemForm
        isOpen={isItemFormOpen}
        onClose={() => setIsItemFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingItem}
      />

      {itemToDelete && (
        <DeleteConfirmationDialog
          isOpen={isDeleteConfirmOpen}
          onClose={() => setIsDeleteConfirmOpen(false)}
          onConfirm={confirmDeleteItem}
          itemName={itemToDelete.name}
        />
      )}
    </div>
  );
}
import type { ItemCategory } from './constants';

export interface Item {
  id: string; // Used for "ID No."
  code: string;
  name: string;
  category: ItemCategory;
  stock: number; // Corresponds to "QTY"
  price: number;
  minStock: number; // Not directly displayed in the manage table per image, but useful for form
  modifiedDate: string; // ISO date string, e.g., "2018-06-19T00:00:00.000Z"
}

export interface Transaction {
  id: string;
  customerName: string;
  invoiceId: string;
  totalPrice: number;
  lastDate: string; // Assuming this is a date for the last update/activity
  createDate: string; // Date the transaction was created
}

"use client";

import { useState, useEffect } from 'react';
import { StatCard } from '@/components/dashboard/stat-card';
import { BestSellingChart } from '@/components/dashboard/best-selling-chart';
import { Box, Banknote, Boxes } from 'lucide-react';
import { useAuth } from '@/contexts/auth-provider'; // Import useAuth

const bestSellingData = [
  { name: 'FMS', value: 145 },
  { name: 'BNT', value: 133 },
  { name: 'SPD', value: 112 },
  { name: 'SPW', value: 42 },
];

// Dummy data for stats
const todaySales = 187000; // Example sales amount
const productsSold = 103;

export default function DashboardPage() {
  const { user } = useAuth(); // Get user from auth context
  const [dateTime, setDateTime] = useState({ date: '', time: '' });
  const [totalStock, setTotalStock] = useState(0);

  useEffect(() => {
    // Fetch total stock from the database
    const fetchTotalStock = async () => {
      try {
        const res = await fetch('/api/items');
        const items = await res.json();
        const total = items.reduce((sum: number, item: { stock: number }) => sum + item.stock, 0);
        setTotalStock(total);
      } catch (error) {
        console.error("Failed to fetch total stock:", error);
      }
    };

    fetchTotalStock();

    const updateDateTime = () => {
      const now = new Date();
      setDateTime({
        date: now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      });
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const formatCurrency = (amount: number) => {
  // Use Intl.NumberFormat for robust, locale-aware formatting
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0, // No decimal places
    maximumFractionDigits: 0, // No decimal places
  });

  // The formatter automatically adds "Rp" and the correct separators.
  // We'll remove the "Rp" part and add our own "Rp. " prefix for consistency.
  return "Rp. " + formatter.format(amount).replace('Rp', '').trim();
};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg bg-card p-6 shadow-md lg:col-span-2">
          <h1 className="text-4xl font-semibold">
            <span style={{color: 'hsl(var(--highlight-text-on-card))'}}>Hi, </span>
            <span className="text-accent">{user?.username || 'User'}</span>
            <span style={{color: 'hsl(var(--highlight-text-on-card))'}}>!</span>
          </h1>
          <p className="mt-1 text-muted-foreground">What you wanna do today?</p>
        </div>
        <div className="rounded-lg bg-card p-6 text-center shadow-md">
          <p className="text-sm text-muted-foreground">{dateTime.date}</p>
          <p className="mt-1 text-5xl font-bold" style={{color: 'hsl(var(--highlight-text-on-card))'}}>
            {dateTime.time}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Stock"
          value={totalStock.toLocaleString()}
          icon={<Box />}
        />
        <StatCard
          title="Today's Sales"
          value={formatCurrency(todaySales)}
          icon={<Banknote />}
        />
        <StatCard
          title="Product Sold"
          value={productsSold.toLocaleString()}
          icon={<Boxes />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BestSellingChart items={bestSellingData} />
      </div>
    </div>
  );
}
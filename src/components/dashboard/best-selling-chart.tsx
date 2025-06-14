"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface BestSellingItem {
  name: string;
  value: number;
}

interface BestSellingChartProps {
  items: BestSellingItem[];
  cardClassName?: string;
  titleClassName?: string;
}

export function BestSellingChart({ 
  items,
  cardClassName = "bg-card shadow-md rounded-lg",
  titleClassName = "text-lg font-semibold text-foreground"
}: BestSellingChartProps) {
  if (!items || items.length === 0) {
    return (
      <Card className={cardClassName}>
        <CardHeader>
          <CardTitle className={titleClassName}>Best-selling Item</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No sales data available.</p>
        </CardContent>
      </Card>
    );
  }

  const maxValue = Math.max(...items.map(item => item.value), 0);

  return (
    <Card className={cardClassName}>
      <CardHeader>
        <CardTitle className={titleClassName}>Best-selling Item</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        {items.map((item) => (
          <div key={item.name} className="grid grid-cols-[50px_1fr_50px] items-center gap-3">
            <span className="text-sm font-medium text-foreground truncate">{item.name}</span>
            <Progress 
              value={maxValue > 0 ? (item.value / maxValue) * 100 : 0} 
              className="h-4 bg-muted [&>div]:bg-primary" 
            />
            <span className="text-sm text-right text-muted-foreground">{item.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

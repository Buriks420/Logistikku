
"use client";

import * as React from 'react'; // Added this line
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>; 
  unit?: string;
  cardClassName?: string;
  iconClassName?: string;
  valueClassName?: string;
  titleClassName?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  unit, 
  cardClassName = "bg-card shadow-md rounded-lg",
  iconClassName = "h-8 w-8 text-accent",
  valueClassName = "text-3xl font-semibold text-foreground",
  titleClassName = "text-sm font-medium text-muted-foreground"
}: StatCardProps) {
  return (
    <Card className={cardClassName}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={titleClassName}>{title}</CardTitle>
         {React.cloneElement(icon, { className: iconClassName })}
      </CardHeader>
      <CardContent>
        <div className={valueClassName}>
          {value}
          {unit && <span className="text-sm font-normal ml-1">{unit}</span>}
        </div>
      </CardContent>
    </Card>
  );
}

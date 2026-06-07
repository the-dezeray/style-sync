'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, TrendingDown, Download, Loader2 } from 'lucide-react';
import { subscribeToCollection } from '@/lib/firestore-utils';
import { InventoryItem, Transaction } from '@/lib/types';

export default function FinancePage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubInventory = subscribeToCollection<InventoryItem>('inventory', setInventory);
    const unsubTransactions = subscribeToCollection<Transaction>('transactions', setTransactions);

    const timer = setTimeout(() => setIsLoading(false), 1000);

    return () => {
      unsubInventory();
      unsubTransactions();
      clearTimeout(timer);
    };
  }, []);

  const totalSales = transactions.reduce((sum, t) => sum + (t.pulla || 0), 0);
  const totalCost = inventory.reduce((sum, item) => sum + (item.costPrice * (item.soldCount || 0)), 0);
  const totalProfit = totalSales - totalCost;
  
  // Weekly/Daily simulations based on total
  const dailySales = totalSales / 30;
  const weeklySales = totalSales / 4;

  const expenses = [
    { category: 'Supplier Payments', pulla: totalCost },
    { category: 'Shipping Fees', pulla: 5200 },
    { category: 'Rent', pulla: 4000 },
    { category: 'Utilities', pulla: 1500 },
    { category: 'Salaries', pulla: 5500 },
  ];

  const totalExpenses = expenses.reduce((sum, e) => sum + e.pulla, 0);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance Tracking</h1>
          <p className="text-muted-foreground">Monitor your revenue, expenses, and profits</p>
        </div>
        <Button className="gap-2" variant="outline">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Period Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Daily (Avg)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Sales</span>
              <span className="font-semibold">P{dailySales.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-sm font-medium">Est. Profit</span>
              <span className="font-bold text-green-500">P{(totalProfit / 30).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Weekly (Avg)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Sales</span>
              <span className="font-semibold">P{weeklySales.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-sm font-medium">Est. Profit</span>
              <span className="font-bold text-green-500">P{(totalProfit / 4).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/20 bg-linear-to-br from-yellow-400/5 to-yellow-600/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Total</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Sales</span>
              <span className="font-semibold">P{totalSales.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-sm font-medium">Net Profit</span>
              <span className="font-bold text-green-500">P{totalProfit.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Profit Tracking */}
        <Card>
          <CardHeader>
            <CardTitle>Profit Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-green-500/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Profit (All Time)</p>
                    <p className="text-2xl font-bold">P{totalProfit.toLocaleString()}</p>
                  </div>
                </div>
                <Badge variant="success" className="gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +15.3%
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Profit Margin</span>
                  <span className="font-medium">{totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div 
                    className="h-full bg-linear-to-r from-green-400 to-green-600" 
                    style={{ width: `${totalSales > 0 ? (totalProfit / totalSales) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenses.map((expense, index) => {
                const percentage = (expense.pulla / totalExpenses) * 100;
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{expense.category}</span>
                      <span className="font-medium">P{expense.pulla.toLocaleString()}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-linear-to-r from-red-400 to-red-600"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sales Revenue</p>
                <p className="text-2xl font-bold">P{totalSales.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Supplier Cost</p>
                <p className="text-2xl font-bold">P{totalCost.toLocaleString()}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Operational Expenses</p>
                <p className="text-2xl font-bold">P{(totalExpenses - totalCost).toLocaleString()}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-2xl font-bold text-green-500">P{totalProfit.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

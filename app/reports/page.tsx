'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Download, TrendingUp, DollarSign, Package, Users, Loader2 } from 'lucide-react';
import { subscribeToCollection } from '@/lib/firestore-utils';
import { InventoryItem, Transaction, Customer } from '@/lib/types';

export default function ReportsPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubInventory = subscribeToCollection<InventoryItem>('inventory', setInventory);
    const unsubTransactions = subscribeToCollection<Transaction>('transactions', setTransactions);
    const unsubCustomers = subscribeToCollection<Customer>('customers', setCustomers);

    const timer = setTimeout(() => setIsLoading(false), 1000);

    return () => {
      unsubInventory();
      unsubTransactions();
      unsubCustomers();
      clearTimeout(timer);
    };
  }, []);

  const totalRevenue = transactions.reduce((sum, t) => sum + (t.pulla || 0), 0);
  const totalCost = inventory.reduce((sum, item) => sum + (item.costPrice * (item.soldCount || 0)), 0);
  const totalProfit = totalRevenue - totalCost;
  const productsSold = inventory.reduce((sum, item) => sum + (item.soldCount || 0), 0);
  const activeCustomers = customers.length;

  // Monthly breakdown simulation
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const monthlyData = months.map((m, i) => ({
    month: m,
    sales: i === 5 ? totalRevenue : (totalRevenue / 6) * (0.8 + Math.random() * 0.4)
  }));

  // Category breakdown
  const categories = ['Clothing', 'Accessories', 'Shoes', 'Repairs'];
  const categoryData = categories.map(cat => {
    const catItems = inventory.filter(item => item.category.toLowerCase() === cat.toLowerCase());
    const catSales = catItems.reduce((sum, item) => sum + (item.sellingPrice * (item.soldCount || 0)), 0);
    return { name: cat, sales: catSales };
  });

  const totalCatSales = categoryData.reduce((sum, c) => sum + c.sales, 0);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">View detailed business insights and analytics</p>
        </div>
        <Button className="gap-2" variant="outline">
          <Download className="h-4 w-4" />
          Export All Reports
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">P{totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-500">+12.5% from last month</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Profit</p>
                <p className="text-2xl font-bold">P{totalProfit.toLocaleString()}</p>
                <p className="text-xs text-green-500">+8.2% from last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Products Sold</p>
                <p className="text-2xl font-bold">{productsSold.toLocaleString()}</p>
                <p className="text-xs text-green-500">+15.3% from last month</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Customers</p>
                <p className="text-2xl font-bold">{activeCustomers}</p>
                <p className="text-xs text-green-500">+6.8% from last month</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Performance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sales Performance</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.month}</span>
                  <span className="text-muted-foreground">P{item.sales.toLocaleString()}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-purple-600"
                    style={{ width: `${(item.sales / (totalRevenue / 3)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue vs Profit */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryData.map((cat, idx) => (
              <div key={idx} className={`flex items-center justify-between rounded-lg p-4 ${
                idx === 0 ? 'bg-blue-500/10' : idx === 1 ? 'bg-green-500/10' : idx === 2 ? 'bg-purple-500/10' : 'bg-yellow-500/10'
              }`}>
                <span className="font-medium">{cat.name}</span>
                <span className="text-lg font-bold">P{cat.sales.toLocaleString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Performance (%)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryData.map((cat, idx) => {
              const percentage = totalCatSales > 0 ? (cat.sales / totalCatSales) * 100 : 0;
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{cat.name}</span>
                    <span className="font-medium">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div 
                      className={`h-full bg-gradient-to-r ${
                        idx === 0 ? 'from-blue-400 to-blue-600' : idx === 1 ? 'from-green-400 to-green-600' : idx === 2 ? 'from-purple-400 to-purple-600' : 'from-yellow-400 to-yellow-600'
                      }`} 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Additional Reports */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer transition-all hover:shadow-lg">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400/20 to-blue-600/20">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold">Inventory Report</p>
              <p className="text-sm text-muted-foreground">Stock levels & trends</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-all hover:shadow-lg">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-400/20 to-green-600/20">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold">Customer Report</p>
              <p className="text-sm text-muted-foreground">Loyalty & spending</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-all hover:shadow-lg">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-400/20 to-purple-600/20">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold">Financial Report</p>
              <p className="text-sm text-muted-foreground">Profit & expenses</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

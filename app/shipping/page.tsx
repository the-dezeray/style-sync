'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Truck, Package, DollarSign, Calculator, Info } from 'lucide-react';
import { shippingRates, roundWeight } from '@/lib/mock-data';
import { toast } from 'sonner';

export default function ShippingPage() {
  const [weight, setWeight] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [category, setCategory] = useState<'clothing' | 'accessories' | 'shoes' | 'repairs'>('clothing');
  const [calculatedCost, setCalculatedCost] = useState<number | null>(null);
  const [roundedWeight, setRoundedWeight] = useState<number | null>(null);

  const calculateShipping = () => {
    const weightNum = parseFloat(weight);
    const quantityNum = parseInt(quantity);
    
    if (isNaN(weightNum) || weightNum <= 0) {
      toast.error('Please enter a valid weight');
      return;
    }
    
    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    // Apply weight rounding
    const rounded = roundWeight(weightNum);
    setRoundedWeight(rounded);
    
    const rate = shippingRates[category];
    const costPerItem = rate.baseRate + (rounded * rate.perKg);
    const totalCost = costPerItem * quantityNum;
    
    setCalculatedCost(totalCost);
    toast.success('Shipping cost calculated');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shipping Management</h1>
        <p className="text-muted-foreground">Calculate shipping costs and manage deliveries</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Shipments</p>
                <p className="text-2xl font-bold">18</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Transit</p>
                <p className="text-2xl font-bold">34</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Delivered Today</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shipping Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Shipping Cost Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-blue-500/10 p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-600">Auto Weight Rounding</p>
              <p className="text-muted-foreground">
                Weights are automatically rounded: 1.1→1.5kg, 2.05→2.5kg, 3.6→4.0kg
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Category</label>
              <div className="grid grid-cols-2 gap-2">
                {(['clothing', 'accessories', 'shoes', 'repairs'] as const).map((cat) => (
                  <Button
                    key={cat}
                    variant={category === cat ? 'default' : 'outline'}
                    onClick={() => setCategory(cat)}
                    className="capitalize"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Weight (kg)</label>
              <Input
                type="number"
                placeholder="Enter weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="0"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                step="1"
              />
            </div>
          </div>

          <Button onClick={calculateShipping} className="w-full gap-2">
            <Calculator className="h-4 w-4" />
            Calculate Shipping Cost
          </Button>

          {calculatedCost !== null && roundedWeight !== null && (
            <div className="rounded-lg bg-linear-to-br from-purple-400/10 to-purple-600/10 p-6 space-y-3">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Estimated Shipping Cost</p>
                <p className="text-4xl font-bold">P{calculatedCost.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span>Rounded Weight: {roundedWeight}kg</span>
                <span>•</span>
                <span>Quantity: {quantity}</span>
                <span>•</span>
                <span>Category: {category}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shipping Rates */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(shippingRates).map(([cat, rate]) => (
              <div key={cat} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium capitalize">{cat}</p>
                  <p className="text-sm text-muted-foreground">
                    Base: P{rate.baseRate} + P{rate.perKg}/kg
                  </p>
                </div>
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

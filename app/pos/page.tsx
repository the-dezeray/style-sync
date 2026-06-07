'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, Wallet, Smartphone, Banknote, Loader2 } from 'lucide-react';
import { subscribeToCollection, updateDocument, addDocument } from '@/lib/firestore-utils';
import { InventoryItem } from '@/lib/types';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sku: string;
  availableStock: number;
}

type PaymentMethod = 'cash' | 'card' | 'mobile' | null;

export default function POSPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToCollection<InventoryItem>('inventory', (data) => {
      setInventory(data);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredItems = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (item: InventoryItem) => {
    const existingItem = cart.find(i => i.id === item.id);
    const currentCartQuantity = existingItem ? existingItem.quantity : 0;
    
    if (currentCartQuantity >= item.stock) {
      toast.error('Not enough stock available');
      return;
    }
    
    if (existingItem) {
      setCart(cart.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCart([...cart, {
        id: item.id,
        name: item.name,
        price: item.sellingPrice,
        quantity: 1,
        sku: item.sku,
        availableStock: item.stock,
      }]);
    }
    toast.success(`${item.name} added to cart`);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, Math.min(item.availableStock, item.quantity + delta));
        if (newQuantity === item.availableStock && delta > 0) {
          toast.warning('Maximum stock reached');
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
    toast.info('Item removed from cart');
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    setShowPaymentDialog(true);
  };

  const processPayment = async () => {
    if (!selectedPayment) {
      toast.error('Please select a payment method');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Update Inventory in Firestore
      const updatePromises = cart.map(cartItem => {
        const inventoryItem = inventory.find(i => i.id === cartItem.id);
        if (inventoryItem) {
          const newStock = inventoryItem.stock - cartItem.quantity;
          const newSoldCount = (inventoryItem.soldCount || 0) + cartItem.quantity;
          const newStatus = newStock === 0 ? 'out-of-stock' : newStock <= 10 ? 'low-stock' : 'in-stock';
          
          return updateDocument('inventory', inventoryItem.id, {
            stock: newStock,
            soldCount: newSoldCount,
            status: newStatus
          });
        }
        return Promise.resolve();
      });

      // 2. Record Transaction in Firestore
      const transactionData = {
        customer: 'Walk-in Customer',
        pulla: total,
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
        paymentMethod: selectedPayment,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      };

      await Promise.all([
        ...updatePromises,
        addDocument('transactions', transactionData)
      ]);
      
      const paymentMethodNames = {
        cash: 'Cash',
        card: 'Card',
        mobile: 'Mobile Payment'
      };
      
      toast.success(`Payment processed via ${paymentMethodNames[selectedPayment]}!`);
      toast.info('Stock levels and transactions updated');
      
      setCart([]);
      setShowPaymentDialog(false);
      setSelectedPayment(null);
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error('Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
      </div>
    );
  }

  const paymentMethods = [
    { id: 'cash' as const, name: 'Cash', icon: Banknote },
    { id: 'card' as const, name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'mobile' as const, name: 'Mobile Payment', icon: Smartphone },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Point of Sale</h1>
        <p className="text-muted-foreground">Process sales and manage transactions</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products by name or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.sku}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <p className="text-lg font-bold">P{item.sellingPrice}</p>
                        <Badge variant={item.status === 'in-stock' ? 'success' : item.status === 'low-stock' ? 'warning' : 'destructive'}>
                          {item.stock} in stock
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addToCart(item)}
                      disabled={item.stock === 0}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Current Sale
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-sm text-muted-foreground">Cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="rounded-lg border p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.sku}</p>
                            <p className="mt-1 text-sm font-semibold">P{item.price}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="h-8 w-8 p-0 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <span className="ml-auto font-semibold">
                            P{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">P{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (8%)</span>
                      <span className="font-medium">P{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 text-lg font-bold">
                      <span>Total</span>
                      <span>P{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full gap-2 bg-linear-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700"
                  >
                    <Wallet className="h-4 w-4" />
                    Proceed to Payment
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Method Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`w-full flex items-center gap-4 rounded-lg border-2 p-4 transition-all ${
                    selectedPayment === method.id
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-border hover:border-purple-500/50'
                  }`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    selectedPayment === method.id ? 'bg-purple-500' : 'bg-muted'
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      selectedPayment === method.id ? 'text-white' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">{method.name}</p>
                  </div>
                  {selectedPayment === method.id && (
                    <div className="h-5 w-5 rounded-full bg-purple-500 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <div className="rounded-lg bg-muted p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Total Pula</span>
              <span className="font-medium">P{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>To Pay</span>
              <span className="text-purple-600">P{total.toFixed(2)}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={processPayment}
              className="gap-2 bg-linear-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700"
            >
              <CreditCard className="h-4 w-4" />
              Complete Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

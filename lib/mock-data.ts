// Mock data for STYLESYNC.COM Admin Dashboard

export const dashboardStats = {
  totalSales: 125840,
  totalProfit: 45230,
  totalInventory: 1247,
  pendingRepairs: 23,
  monthlyRevenue: 89450,
  lowStockAlerts: 12,
};

export const salesData = [
  { month: 'Jan', sales: 12000, revenue: 15000 },
  { month: 'Feb', sales: 15000, revenue: 18500 },
  { month: 'Mar', sales: 18000, revenue: 22000 },
  { month: 'Apr', sales: 14000, revenue: 17500 },
  { month: 'May', sales: 21000, revenue: 26000 },
  { month: 'Jun', sales: 25000, revenue: 31000 },
];

export const recentTransactions = [
  { id: 'TXN-001', customer: 'Sarah Johnson', pulla: 450, date: '2026-05-19', status: 'completed' },
  { id: 'TXN-002', customer: 'Michael Chen', pulla: 890, date: '2026-05-19', status: 'completed' },
  { id: 'TXN-003', customer: 'Emma Williams', pulla: 320, date: '2026-05-18', status: 'pending' },
  { id: 'TXN-004', customer: 'James Brown', pulla: 1250, date: '2026-05-18', status: 'completed' },
  { id: 'TXN-005', customer: 'Olivia Davis', pulla: 680, date: '2026-05-17', status: 'completed' },
];

export const topSellingItems = [
  { id: 1, name: 'Designer Leather Jacket', category: 'Clothing', sold: 45, revenue: 22500 },
  { id: 2, name: 'Premium Sneakers', category: 'Shoes', sold: 67, revenue: 20100 },
  { id: 3, name: 'Luxury Handbag', category: 'Accessories', sold: 34, revenue: 17000 },
  { id: 4, name: 'Silk Evening Dress', category: 'Clothing', sold: 28, revenue: 14000 },
  { id: 5, name: 'Gold Watch', category: 'Accessories', sold: 19, revenue: 9500 },
];

export const inventoryItems = [
  {
    id: 'INV-001',
    name: 'Designer Leather Jacket',
    sku: 'CLT-LJ-001',
    category: 'Clothing',
    costPrice: 350,
    sellingPrice: 500,
    stock: 15,
    status: 'in-stock',
    image: '/placeholder-jacket.jpg',
    soldCount: 45,
    damagedCount: 0,
    restockHistory: [
      { date: '2026-05-01', quantity: 20, supplier: 'Fashion Wholesale Co.' },
      { date: '2026-04-15', quantity: 15, supplier: 'Fashion Wholesale Co.' },
    ],
  },
  {
    id: 'INV-002',
    name: 'Premium Sneakers',
    sku: 'SHO-PS-002',
    category: 'Shoes',
    costPrice: 200,
    sellingPrice: 300,
    stock: 8,
    status: 'low-stock',
    image: '/placeholder-shoes.jpg',
    soldCount: 67,
    damagedCount: 2,
    restockHistory: [
      { date: '2026-05-10', quantity: 30, supplier: 'Shoe Distributors Inc.' },
      { date: '2026-04-20', quantity: 25, supplier: 'Shoe Distributors Inc.' },
    ],
  },
  {
    id: 'INV-003',
    name: 'Luxury Handbag',
    sku: 'ACC-LH-003',
    category: 'Accessories',
    costPrice: 400,
    sellingPrice: 500,
    stock: 0,
    status: 'out-of-stock',
    image: '/placeholder-bag.jpg',
    soldCount: 34,
    damagedCount: 1,
    restockHistory: [
      { date: '2026-04-25', quantity: 10, supplier: 'Luxury Goods Ltd.' },
      { date: '2026-03-30', quantity: 12, supplier: 'Luxury Goods Ltd.' },
    ],
  },
  {
    id: 'INV-004',
    name: 'Silk Evening Dress',
    sku: 'CLT-ED-004',
    category: 'Clothing',
    costPrice: 380,
    sellingPrice: 500,
    stock: 12,
    status: 'in-stock',
    image: '/placeholder-dress.jpg',
    soldCount: 28,
    damagedCount: 0,
    restockHistory: [
      { date: '2026-05-05', quantity: 15, supplier: 'Fashion Wholesale Co.' },
      { date: '2026-04-10', quantity: 10, supplier: 'Fashion Wholesale Co.' },
    ],
  },
  {
    id: 'INV-005',
    name: 'Gold Watch',
    sku: 'ACC-GW-005',
    category: 'Accessories',
    costPrice: 400,
    sellingPrice: 500,
    stock: 3,
    status: 'low-stock',
    image: '/placeholder-watch.jpg',
    soldCount: 19,
    damagedCount: 0,
    restockHistory: [
      { date: '2026-04-28', quantity: 8, supplier: 'Luxury Goods Ltd.' },
      { date: '2026-04-01', quantity: 10, supplier: 'Luxury Goods Ltd.' },
    ],
  },
  {
    id: 'INV-006',
    name: 'Leather Boots',
    sku: 'SHO-LB-006',
    category: 'Shoes',
    costPrice: 180,
    sellingPrice: 280,
    stock: 20,
    status: 'in-stock',
    image: '/placeholder-boots.jpg',
    soldCount: 52,
    damagedCount: 1,
    restockHistory: [
      { date: '2026-05-12', quantity: 25, supplier: 'Shoe Distributors Inc.' },
      { date: '2026-04-18', quantity: 20, supplier: 'Shoe Distributors Inc.' },
    ],
  },
  {
    id: 'INV-007',
    name: 'Zipper Replacement Kit',
    sku: 'REP-ZR-007',
    category: 'Repairs',
    costPrice: 15,
    sellingPrice: 45,
    stock: 50,
    status: 'in-stock',
    image: '/placeholder-repair.jpg',
    soldCount: 120,
    damagedCount: 0,
    restockHistory: [
      { date: '2026-05-08', quantity: 100, supplier: 'Repair Supplies Co.' },
      { date: '2026-04-05', quantity: 100, supplier: 'Repair Supplies Co.' },
    ],
  },
  {
    id: 'INV-008',
    name: 'Shoe Sole Repair Kit',
    sku: 'REP-SR-008',
    category: 'Repairs',
    costPrice: 20,
    sellingPrice: 60,
    stock: 35,
    status: 'in-stock',
    image: '/placeholder-repair.jpg',
    soldCount: 85,
    damagedCount: 0,
    restockHistory: [
      { date: '2026-05-06', quantity: 50, supplier: 'Repair Supplies Co.' },
      { date: '2026-04-12', quantity: 50, supplier: 'Repair Supplies Co.' },
    ],
  },
  {
    id: 'INV-009',
    name: 'Leather Patch Set',
    sku: 'REP-LP-009',
    category: 'Repairs',
    costPrice: 25,
    sellingPrice: 75,
    stock: 8,
    status: 'low-stock',
    image: '/placeholder-repair.jpg',
    soldCount: 45,
    damagedCount: 2,
    restockHistory: [
      { date: '2026-04-22', quantity: 30, supplier: 'Repair Supplies Co.' },
      { date: '2026-03-28', quantity: 25, supplier: 'Repair Supplies Co.' },
    ],
  },
];

export const repairJobs = [
  {
    id: 'REP-001',
    customerName: 'Sarah Johnson',
    phone: '+1 234-567-8901',
    item: 'Designer Leather Jacket',
    issue: 'Zipper replacement',
    cost: 45,
    status: 'pending',
    pickupDate: '2026-05-25',
    notes: 'Customer wants original zipper brand',
  },
  {
    id: 'REP-002',
    customerName: 'Michael Chen',
    phone: '+1 234-567-8902',
    item: 'Premium Sneakers',
    issue: 'Sole repair',
    cost: 60,
    status: 'in-progress',
    pickupDate: '2026-05-22',
    notes: 'Rush order',
  },
  {
    id: 'REP-003',
    customerName: 'Emma Williams',
    phone: '+1 234-567-8903',
    item: 'Luxury Handbag',
    issue: 'Handle replacement',
    cost: 85,
    status: 'ready',
    pickupDate: '2026-05-20',
    notes: 'Matching leather found',
  },
  {
    id: 'REP-004',
    customerName: 'James Brown',
    phone: '+1 234-567-8904',
    item: 'Silk Evening Dress',
    issue: 'Hem alteration',
    cost: 35,
    status: 'completed',
    pickupDate: '2026-05-18',
    notes: 'Picked up',
  },
];

export const customers = [
  {
    id: 'CUST-001',
    name: 'Sarah Johnson',
    phone: '+1 234-567-8901',
    email: 'sarah.j@email.com',
    totalSpent: 2450,
    purchaseCount: 8,
    repairCount: 3,
    loyaltyStatus: 'gold',
    joinDate: '2025-01-15',
  },
  {
    id: 'CUST-002',
    name: 'Michael Chen',
    phone: '+1 234-567-8902',
    email: 'michael.c@email.com',
    totalSpent: 5680,
    purchaseCount: 15,
    repairCount: 5,
    loyaltyStatus: 'platinum',
    joinDate: '2024-08-22',
  },
  {
    id: 'CUST-003',
    name: 'Emma Williams',
    phone: '+1 234-567-8903',
    email: 'emma.w@email.com',
    totalSpent: 1230,
    purchaseCount: 4,
    repairCount: 1,
    loyaltyStatus: 'silver',
    joinDate: '2025-11-10',
  },
  {
    id: 'CUST-004',
    name: 'James Brown',
    phone: '+1 234-567-8904',
    email: 'james.b@email.com',
    totalSpent: 890,
    purchaseCount: 3,
    repairCount: 2,
    loyaltyStatus: 'bronze',
    joinDate: '2026-02-05',
  },
];

export const financeData = {
  daily: { sales: 3450, expenses: 1200, profit: 2250 },
  weekly: { sales: 24150, expenses: 8400, profit: 15750 },
  monthly: { sales: 89450, expenses: 31200, profit: 58250 },
  expenses: [
    { category: 'Supplier Payments', pulla: 15000 },
    { category: 'Shipping Fees', pulla: 5200 },
    { category: 'Rent', pulla: 4000 },
    { category: 'Utilities', pulla: 1500 },
    { category: 'Salaries', pulla: 5500 },
  ],
};

export const shippingRates = [
  { min: 1,   max: 25,  perKg: 260 },
  { min: 26,  max: 45,  perKg: 250 },
  { min: 46,  max: 100, perKg: 245 },
  { min: 101, max: 300, perKg: 240 },
];

export function getShippingRate(totalKg: number): number {
  const tier = shippingRates.find(t => totalKg >= t.min && totalKg <= t.max);
  return tier ? tier.perKg : 0;
}

// Helper function for weight rounding
export function roundWeight(weight: number): number {
  if (weight <= 0) return 0;
  
  const decimal = weight % 1;
  const whole = Math.floor(weight);
  
  // Apply rounding rules
  if (decimal > 0 && decimal <= 0.5) {
    return whole + 0.5;
  } else if (decimal > 0.5) {
    return whole + 1;
  }
  
  return weight;
}

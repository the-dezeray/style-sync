export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'damaged';
  image?: string;
  soldCount: number;
  damagedCount: number;
  restockHistory: RestockRecord[];
}

export interface RestockRecord {
  date: string;
  quantity: number;
  supplier: string;
}

export interface RepairJob {
  id: string;
  customerName: string;
  phone: string;
  item: string;
  issue: string;
  cost: number;
  status: 'pending' | 'in-progress' | 'ready' | 'completed';
  pickupDate: string;
  notes: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalSpent: number;
  purchaseCount: number;
  repairCount: number;
  loyaltyStatus: 'bronze' | 'silver' | 'gold' | 'platinum';
  joinDate: string;
}

export interface Transaction {
  id: string;
  customer: string;
  pulla: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

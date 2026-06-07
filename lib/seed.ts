import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import { 
  inventoryItems, 
  repairJobs, 
  customers, 
  recentTransactions 
} from './mock-data';

export const seedDatabase = async () => {
  try {
    console.log('Starting database seed...');

    // Helper to clear a collection
    const clearCollection = async (name: string) => {
      const querySnapshot = await getDocs(collection(db, name));
      const deletePromises = querySnapshot.docs.map(d => deleteDoc(doc(db, name, d.id)));
      await Promise.all(deletePromises);
      console.log(`Cleared collection: ${name}`);
    };

    // Clear existing data (optional, but good for fresh seed)
    await clearCollection('inventory');
    await clearCollection('repairs');
    await clearCollection('customers');
    await clearCollection('transactions');

    // Seed Inventory
    for (const item of inventoryItems) {
      const { id, ...data } = item; // Remove mock id to let Firestore generate one
      await addDoc(collection(db, 'inventory'), data);
    }
    console.log('Seeded inventory');

    // Seed Repairs
    for (const job of repairJobs) {
      const { id, ...data } = job;
      await addDoc(collection(db, 'repairs'), data);
    }
    console.log('Seeded repairs');

    // Seed Customers
    for (const customer of customers) {
      const { id, ...data } = customer;
      await addDoc(collection(db, 'customers'), data);
    }
    console.log('Seeded customers');

    // Seed Transactions
    for (const txn of recentTransactions) {
      const { id, ...data } = txn;
      await addDoc(collection(db, 'transactions'), data);
    }
    console.log('Seeded transactions');

    console.log('Database seeded successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, error };
  }
};

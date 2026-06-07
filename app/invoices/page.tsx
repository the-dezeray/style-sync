'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Download, Eye, Send, Building2, Loader2 } from 'lucide-react';
import { subscribeToCollection } from '@/lib/firestore-utils';
import { Transaction } from '@/lib/types';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

export default function InvoicesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Transaction | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToCollection<Transaction>('transactions', (data) => {
      setTransactions(data);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const totalInvoices = transactions.length;
  const paidInvoices = transactions.filter(t => t.status === 'completed').length;
  const pendingInvoices = transactions.filter(t => t.status === 'pending').length;
  const totalPula = transactions.reduce((sum, t) => sum + (t.pulla || 0), 0);

  const generatePDF = (invoice: Transaction) => {
    const doc = new jsPDF();
    
    // Company Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('STYLESYNC.COM', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Fashion & Accessories Store', 105, 28, { align: 'center' });
    doc.text('123 Fashion Street, Style City, SC 12345', 105, 34, { align: 'center' });
    doc.text('Phone: (555) 123-4567 | Email: info@stylesync.com', 105, 40, { align: 'center' });
    
    // Invoice Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 20, 60);
    
    // Invoice Details
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice Number: ${invoice.id.slice(0, 8)}`, 20, 70);
    doc.text(`Date: ${invoice.date}`, 20, 76);
    doc.text(`Status: ${invoice.status.toUpperCase()}`, 20, 82);
    
    // Customer Details
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 20, 95);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.customer, 20, 101);
    
    // Line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 110, 190, 110);
    
    // Table Header
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(250, 204, 21);
    doc.rect(20, 115, 170, 8, 'F');
    doc.text('Description', 25, 120);
    doc.text('Pulla', 170, 120, { align: 'right' });
    
    // Table Content
    doc.setFont('helvetica', 'normal');
    doc.text('Products & Services', 25, 130);
    doc.text(`P${invoice.pulla.toFixed(2)}`, 185, 130, { align: 'right' });
    
    // Subtotal
    doc.line(20, 140, 190, 140);
    doc.setFont('helvetica', 'bold');
    doc.text('Subtotal:', 140, 148);
    doc.text(`P${invoice.pulla.toFixed(2)}`, 185, 148, { align: 'right' });
    
    const tax = invoice.pulla * 0.08;
    doc.setFont('helvetica', 'normal');
    doc.text('Tax (8%):', 140, 154);
    doc.text(`P${tax.toFixed(2)}`, 185, 154, { align: 'right' });
    
    // Total
    doc.setDrawColor(0, 0, 0);
    doc.line(140, 160, 190, 160);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    const total = invoice.pulla + tax;
    doc.text('TOTAL:', 140, 168);
    doc.text(`P${total.toFixed(2)}`, 185, 168, { align: 'right' });
    
    // Footer
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for your business!', 105, 250, { align: 'center' });
    doc.text('Payment is due within 30 days', 105, 256, { align: 'center' });
    
    return doc;
  };

  const handleDownload = (invoice: Transaction) => {
    const doc = generatePDF(invoice);
    doc.save(`Invoice-${invoice.id.slice(0, 8)}.pdf`);
    toast.success(`Invoice ${invoice.id.slice(0, 8)} downloaded`);
  };

  const handlePreview = (invoice: Transaction) => {
    setSelectedInvoice(invoice);
    setShowPreview(true);
  };

  const handleSend = (id: string) => {
    toast.success(`Invoice ${id.slice(0, 8)} sent to customer via email`);
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-yellow-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoice Management</h1>
          <p className="text-muted-foreground">View and manage customer invoices</p>
        </div>
        <Button className="gap-2 bg-linear-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700">
          <FileText className="h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Invoices</p>
              <p className="text-2xl font-bold">{totalInvoices}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Paid</p>
              <p className="text-2xl font-bold text-green-500">{paidInvoices}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-yellow-500">{pendingInvoices}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Pula</p>
              <p className="text-2xl font-bold">P{totalPula.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-yellow-400/20 to-yellow-600/20">
                    <FileText className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{transaction.customer}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.id.slice(0, 8)} • {transaction.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold">P{transaction.pulla}</p>
                    <Badge
                      variant={transaction.status === 'completed' ? 'success' : 'warning'}
                    >
                      {transaction.status}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(transaction)}
                      title="Download PDF"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSend(transaction.id)}
                      title="Send via Email"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handlePreview(transaction)}
                      title="Preview Invoice"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">No invoices found</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Invoice Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invoice Preview</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6 p-6 bg-white text-black">
              {/* Company Header */}
              <div className="text-center border-b pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Building2 className="h-8 w-8 text-yellow-600" />
                  <h1 className="text-3xl font-bold">STYLESYNC.COM</h1>
                </div>
                <p className="text-sm text-gray-600">Fashion & Accessories Store</p>
                <p className="text-xs text-gray-500">123 Fashion Street, Style City, SC 12345</p>
                <p className="text-xs text-gray-500">Phone: (555) 123-4567 | Email: info@stylesync.com</p>
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h2 className="text-xl font-bold mb-2">INVOICE</h2>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-semibold">Invoice #:</span> {selectedInvoice.id.slice(0, 8)}</p>
                    <p><span className="font-semibold">Date:</span> {selectedInvoice.date}</p>
                    <p><span className="font-semibold">Status:</span> <span className="uppercase">{selectedInvoice.status}</span></p>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Bill To:</h3>
                  <p className="text-sm">{selectedInvoice.customer}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-yellow-400 p-3 font-bold grid grid-cols-2">
                  <span>Description</span>
                  <span className="text-right">Pulla</span>
                </div>
                <div className="p-3 grid grid-cols-2 border-b">
                  <span>Products & Services</span>
                  <span className="text-right">P{selectedInvoice.pulla.toFixed(2)}</span>
                </div>
                <div className="p-3 space-y-2">
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-right col-start-1">Subtotal:</span>
                    <span className="text-right">P{selectedInvoice.pulla.toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-right col-start-1">Tax (8%):</span>
                    <span className="text-right">P{(selectedInvoice.pulla * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-2 font-bold text-lg border-t pt-2">
                    <span className="text-right col-start-1">TOTAL:</span>
                    <span className="text-right">P{(selectedInvoice.pulla * 1.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-sm text-gray-600 border-t pt-4">
                <p className="italic">Thank you for your business!</p>
                <p className="text-xs">Payment is due within 30 days</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => handleDownload(selectedInvoice)}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <Button
                  onClick={() => {
                    handleSend(selectedInvoice.id);
                    setShowPreview(false);
                  }}
                  className="gap-2 bg-linear-to-r from-yellow-400 to-yellow-600"
                >
                  <Send className="h-4 w-4" />
                  Send Invoice
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

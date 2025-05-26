export interface Item {
  id: string;
  name: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  price: number;
  gstRate: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
}

export interface Customer {
  name: string;
  address: string;
  gstin?: string;
  email: string;
  phone: string;
}

export interface Invoice {
  id: string;
  date: string;
  invoiceNumber: string;
  customer: Customer;
  items: Item[];
  subtotal: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  total: number;
  notes?: string;
}

export interface Quotation extends Omit<Invoice, 'invoiceNumber'> {
  quotationNumber: string;
  validUntil: string;
} 
import React, { useState, useRef, useEffect } from 'react';
import {
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';
import { Invoice, Item, Customer } from '../../types';

const CreateInvoice: React.FC = () => {
  const [invoice, setInvoice] = useState<Partial<Invoice>>({
    date: new Date().toISOString().split('T')[0],
    items: [],
    customer: {} as Customer,
  });
  const [selectedItem, setSelectedItem] = useState<Partial<Item>>({});
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const generateInvoiceNumber = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0].replace(/-/g, '');
    const time = now.toTimeString().split(' ')[0].replace(/:/g, '');
    const random = Math.floor(100 + Math.random() * 900);
    return `INV-${date}${time}-${random}`;
  };

  useEffect(() => {
    setInvoice((prev) => ({
      ...prev,
      invoiceNumber: generateInvoiceNumber(),
    }));
  }, []);

  const calculateTotals = (items: Item[]) => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const cgstTotal = items.reduce((sum, item) => sum + item.cgst, 0);
    const sgstTotal = items.reduce((sum, item) => sum + item.sgst, 0);
    const igstTotal = items.reduce((sum, item) => sum + item.igst, 0);
    const total = subtotal + cgstTotal + sgstTotal + igstTotal;

    return { subtotal, cgstTotal, sgstTotal, igstTotal, total };
  };

  const handleAddItem = () => {
    if (!selectedItem.name || !selectedItem.quantity || !selectedItem.price)
      return;

    const quantity = Number(selectedItem.quantity);
    const price = Number(selectedItem.price);
    const gstRate = Number(selectedItem.gstRate);

    const amount = quantity * price;
    const gstAmount = (amount * gstRate) / 100;

    const newItem: Item = {
      ...(selectedItem as Item),
      id: Date.now().toString(),
      cgst: gstAmount / 2,
      sgst: gstAmount / 2,
      igst: 0,
      total: amount + gstAmount,
    };

    const updatedItems = [...(invoice.items || []), newItem];
    const totals = calculateTotals(updatedItems);

    setInvoice({
      ...invoice,
      items: updatedItems,
      ...totals,
    });
    setSelectedItem({});
  };

  const handleRemoveItem = (id: string) => {
    const updatedItems = (invoice.items || []).filter((item) => item.id !== id);
    const totals = calculateTotals(updatedItems);

    setInvoice({
      ...invoice,
      items: updatedItems,
      ...totals,
    });
  };

  return (
    <div>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Create New Invoice
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Invoice Number"
              value={invoice.invoiceNumber || ''}
              onChange={(e) =>
                setInvoice({ ...invoice, invoiceNumber: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              type="date"
              label="Date"
              value={invoice.date}
              onChange={(e) => setInvoice({ ...invoice, date: e.target.value })}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Customer Name"
              value={invoice.customer?.name || ''}
              onChange={(e) =>
                setInvoice({
                  ...invoice,
                  customer: {
                    ...invoice.customer,
                    name: e.target.value,
                  } as Customer,
                })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Customer GSTIN"
              value={invoice.customer?.gstin || ''}
              onChange={(e) =>
                setInvoice({
                  ...invoice,
                  customer: {
                    ...invoice.customer,
                    gstin: e.target.value,
                  } as Customer,
                })
              }
              margin="normal"
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Add Items
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Item Name"
              value={selectedItem.name || ''}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, name: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              type="number"
              label="Quantity"
              value={selectedItem.quantity || ''}
              onChange={(e) =>
                setSelectedItem({
                  ...selectedItem,
                  quantity: Number(e.target.value),
                })
              }
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              type="number"
              label="Price"
              value={selectedItem.price || ''}
              onChange={(e) =>
                setSelectedItem({
                  ...selectedItem,
                  price: Number(e.target.value),
                })
              }
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              type="number"
              label="GST Rate (%)"
              value={selectedItem.gstRate || ''}
              onChange={(e) =>
                setSelectedItem({
                  ...selectedItem,
                  gstRate: Number(e.target.value),
                })
              }
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddItem}
              fullWidth
            >
              Add Item
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <div ref={componentRef}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h5">Kaveri Paints And Hardware</Typography>
          <Typography variant="body1">
            Commercial Complex 2-73(2)<br />
           Sajipamunnur,
            <br />
            Phone: +91-9880273919
            <br />
{/*             GSTIN: 22AAAAA0000A1Z5 */}
          </Typography>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <Typography variant="subtitle1">
                <strong>Invoice Number:</strong> {invoice.invoiceNumber}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Date:</strong> {invoice.date}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">
                <strong>Customer Name:</strong> {invoice.customer?.name}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Customer GSTIN:</strong> {invoice.customer?.gstin}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">GST Rate</TableCell>
                <TableCell align="right">CGST</TableCell>
                <TableCell align="right">SGST</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoice.items?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">{item.price}</TableCell>
                  <TableCell align="right">{item.gstRate}%</TableCell>
                  <TableCell align="right">{item.cgst.toFixed(2)}</TableCell>
                  <TableCell align="right">{item.sgst.toFixed(2)}</TableCell>
                  <TableCell align="right">{item.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4} align="right">
                  <strong>Totals:</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>{invoice.cgstTotal?.toFixed(2)}</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>{invoice.sgstTotal?.toFixed(2)}</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>{invoice.total?.toFixed(2)}</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Bank Details
          </Typography>
          <Typography variant="body2">
            <strong>Bank Name:</strong> HDFC Bank
            <br />
            <strong>Account Number:</strong> XXXXXXXXXX1234
            <br />
            <strong>IFSC Code:</strong> HDFC0001234
            <br />
            <strong>Branch:</strong> Koramangala, Bangalore
          </Typography>

          <Grid container justifyContent="space-between" sx={{ mt: 4 }}>
            <Grid item>
              <Typography variant="body1">
                <strong>Authorized Signature:</strong>
              </Typography>
              <img
                src="/signature-seal.png"
                alt="Company Seal and Signature"
                height="80"
              />
            </Grid>
            <Grid item>
              <Typography variant="body2" align="right">
                This is a computer-generated invoice.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </div>

      {/* Visible item table with delete action */}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">GST Rate</TableCell>
              <TableCell align="right">CGST</TableCell>
              <TableCell align="right">SGST</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoice.items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">{item.price}</TableCell>
                <TableCell align="right">{item.gstRate}%</TableCell>
                <TableCell align="right">{item.cgst.toFixed(2)}</TableCell>
                <TableCell align="right">{item.sgst.toFixed(2)}</TableCell>
                <TableCell align="right">{item.total.toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleRemoveItem(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        color="primary"
        onClick={handlePrint}
        sx={{ mt: 2 }}
      >
        Print Invoice
      </Button>
    </div>
  );
};

export default CreateInvoice;

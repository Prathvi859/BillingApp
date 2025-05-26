import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Item } from '../../types';

const ItemsList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<Item>>({});

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setCurrentItem({});
  };

  const handleSave = () => {
    if (currentItem.id) {
      // Edit existing item
      setItems(items.map(item => 
        item.id === currentItem.id ? { ...item, ...currentItem } as Item : item
      ));
    } else {
      // Add new item
      const newItem: Item = {
        ...currentItem,
        id: Date.now().toString(),
        cgst: 0,
        sgst: 0,
        igst: 0,
        total: 0,
      } as Item;
      setItems([...items, newItem]);
    }
    handleClose();
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleEdit = (item: Item) => {
    setCurrentItem(item);
    handleOpen();
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2 }}>
        Add New Item
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>HSN Code</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>GST Rate</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.hsnCode}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.gstRate}%</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentItem.id ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Item Name"
            fullWidth
            value={currentItem.name || ''}
            onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="HSN Code"
            fullWidth
            value={currentItem.hsnCode || ''}
            onChange={(e) => setCurrentItem({ ...currentItem, hsnCode: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={currentItem.price || ''}
            onChange={(e) => setCurrentItem({ ...currentItem, price: Number(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="GST Rate (%)"
            type="number"
            fullWidth
            value={currentItem.gstRate || ''}
            onChange={(e) => setCurrentItem({ ...currentItem, gstRate: Number(e.target.value) })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ItemsList; 
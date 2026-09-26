'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, UploadFile as UploadFileIcon } from '@mui/icons-material';

export interface DynamicTableColumn<T> {
  key: keyof T;
  header: string;
  type?: 'text' | 'number' | 'file';
  placeholder?: string;
  width?: number | string;
  render?: (row: T, onChange: (value: T[keyof T]) => void) => React.ReactNode;
}

export interface DynamicTableProps<T extends { id: number | string }> {
  columns: DynamicTableColumn<T>[];
  rows: T[];
  createRow: () => T;
  onRowsChange: (rows: T[]) => void;
  showSerialNumber?: boolean;
}

export function DynamicTable<T extends { id: number | string }>({
  columns,
  rows,
  createRow,
  onRowsChange,
  showSerialNumber = true,
}: DynamicTableProps<T>) {
  const handleAdd = () => {
    onRowsChange([...rows, createRow()]);
  };

  const handleRemove = (id: number | string) => {
    onRowsChange(rows.filter((row) => row.id !== id));
  };

  const handleCellChange = (id: number | string, key: keyof T, value: T[keyof T]) => {
    onRowsChange(rows.map((row) => (row.id === id ? { ...row, [key]: value } : row)));
  };

  const renderCell = (row: T, column: DynamicTableColumn<T>) => {
    const onChange = (value: T[keyof T]) => handleCellChange(row.id, column.key, value);

    if (column.render) {
      return column.render(row, onChange);
    }

    if (column.type === 'file') {
      const file = row[column.key] as unknown as File | null;
      return (
        <Button
          component="label"
          size="small"
          variant="outlined"
          startIcon={<UploadFileIcon />}
          sx={{ whiteSpace: 'nowrap' }}
        >
          {file ? file.name : 'Upload'}
          <input
            type="file"
            hidden
            onChange={(e) => onChange((e.target.files?.[0] ?? null) as unknown as T[keyof T])}
          />
        </Button>
      );
    }

    return (
      <TextField
        fullWidth
        size="small"
        variant="outlined"
        type={column.type === 'number' ? 'number' : 'text'}
        placeholder={column.placeholder}
        value={row[column.key] ?? ''}
        onChange={(e) => onChange(e.target.value as unknown as T[keyof T])}
      />
    );
  };

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {showSerialNumber && <TableCell sx={{ width: 56 }}>#</TableCell>}
            {columns.map((column) => (
              <TableCell key={String(column.key)} sx={{ width: column.width }}>
                {column.header}
              </TableCell>
            ))}
            <TableCell sx={{ width: 96 }} align="center">
              <IconButton size="small" color="primary" onClick={handleAdd}>
                <AddIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={row.id}>
              {showSerialNumber && <TableCell>{index + 1}</TableCell>}
              {columns.map((column) => (
                <TableCell key={String(column.key)}>{renderCell(row, column)}</TableCell>
              ))}
              <TableCell align="center">
                <IconButton size="small" color="error" onClick={() => handleRemove(row.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

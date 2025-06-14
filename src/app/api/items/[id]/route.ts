import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Function to UPDATE an item
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const itemId = params.id;
    const itemData = await request.json();
    const { code, name, category, stock, price, minStock } = itemData;

    const [result] = await pool.query(
      `UPDATE tbl_barang
       SET kode_barang = ?, nama_barang = ?, kategori = ?, jumlah_stok = ?, harga_beli = ?, stok_minimal = ?
       WHERE id = ?`,
      [code, name, category, stock, price, minStock, itemId]
    );

    return NextResponse.json({ message: 'Item updated successfully', result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error updating item' }, { status: 500 });
  }
}

// Function to DELETE an item
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const itemId = params.id;

    const [result] = await pool.query(
      `DELETE FROM tbl_barang WHERE id = ?`,
      [itemId]
    );

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ message: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error deleting item' }, { status: 500 });
  }
}
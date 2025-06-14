import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import type { Item } from '@/lib/types';

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT id, kode_barang as code, nama_barang as name, kategori as category, jumlah_stok as stock, harga_beli as price, stok_minimal as minStock, updated_at as modifiedDate FROM tbl_barang ORDER BY id DESC");
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const item = await request.json();
    const { code, name, category, stock, price, minStock } = item;

    const [result] = await pool.query(
      "INSERT INTO tbl_barang (kode_barang, nama_barang, kategori, jumlah_stok, harga_beli, stok_minimal) VALUES (?, ?, ?, ?, ?, ?)",
      [code, name, category, stock, price, minStock]
    );

    return NextResponse.json({ message: 'Item added successfully', result }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error adding item' }, { status: 500 });
  }
}
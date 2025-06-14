import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// This function handles GET requests to /api/transactions
export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id, 
        invoice_id as invoiceId, 
        customer_name as customerName, 
        total_price as totalPrice, 
        created_at as createDate,
        created_at as lastDate 
      FROM tbl_transaksi 
      ORDER BY created_at DESC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching transactions' }, { status: 500 });
  }
}

// This function handles POST requests to /api/transactions
export async function POST(request: Request) {
  const connection = await pool.getConnection();
  try {
    const { customerName, invoiceId, totalPrice, items } = await request.json();

    await connection.beginTransaction();

    const [transaksiResult] = await connection.query(
      'INSERT INTO tbl_transaksi (customer_name, invoice_id, total_price) VALUES (?, ?, ?)',
      [customerName, invoiceId, totalPrice]
    );
    const transaksiId = (transaksiResult as any).insertId;

    for (const item of items) {
      await connection.query(
        'INSERT INTO tbl_transaksi_detail (transaksi_id, barang_id, jumlah, harga_saat_transaksi) VALUES (?, ?, ?, ?)',
        [transaksiId, item.id, item.quantity, item.price]
      );
      await connection.query(
        'UPDATE tbl_barang SET jumlah_stok = jumlah_stok - ? WHERE id = ?',
        [item.quantity, item.id]
      );
    }

    await connection.commit();
    return NextResponse.json({ message: 'Transaction created successfully', id: transaksiId }, { status: 201 });

  } catch (error) {
    await connection.rollback();
    console.error(error);
    return NextResponse.json({ message: 'Error creating transaction' }, { status: 500 });
  } finally {
    connection.release();
  }
}
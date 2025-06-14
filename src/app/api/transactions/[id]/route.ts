import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// This function handles PUT requests to /api/transactions/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const itemId = params.id;
    const itemData = await request.json();
    const { code, name, category, stock, price, minStock } = itemData;

    await pool.query(
      `UPDATE tbl_barang
       SET kode_barang = ?, nama_barang = ?, kategori = ?, jumlah_stok = ?, harga_beli = ?, stok_minimal = ?
       WHERE id = ?`,
      [code, name, category, stock, price, minStock, itemId]
    );

    return NextResponse.json({ message: 'Item updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error updating item' }, { status: 500 });
  }
}

// This function handles DELETE requests to /api/transactions/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const connection = await pool.getConnection();
  try {
    const transaksiId = params.id;

    await connection.beginTransaction();

    const [detailRows] = await connection.query(
      'SELECT barang_id, jumlah FROM tbl_transaksi_detail WHERE transaksi_id = ?',
      [transaksiId]
    );

    for (const detail of (detailRows as any[])) {
      await connection.query(
        'UPDATE tbl_barang SET jumlah_stok = jumlah_stok + ? WHERE id = ?',
        [detail.jumlah, detail.barang_id]
      );
    }

    const [deleteResult] = await connection.query(
      'DELETE FROM tbl_transaksi WHERE id = ?',
      [transaksiId]
    );

    await connection.commit();

    if ((deleteResult as any).affectedRows === 0) {
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Transaction deleted and stock restored successfully' });

  } catch (error) {
    await connection.rollback();
    console.error(error);
    return NextResponse.json({ message: 'Error deleting transaction' }, { status: 500 });
  } finally {
    connection.release();
  }
}
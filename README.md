## Prasyarat

Sebelum Anda mulai, pastikan Anda telah menginstal perangkat lunak berikut di sistem Anda.

* **Node.js**
* **npm**
* **MySQL**
* **Git**

## Tutorial


### 1. Clone Repo

```bash
git clone [https://github.com/Buriks420/Logistikku.git](https://github.com/Buriks420/Logistikku.git)
cd Logistikku
```

### 2. Install Dependencies

Perintah ini akan menginstal semua paket yang diperlukan yang didefinisikan dalam `package.json`.

```bash
npm install
```

### 3. Setup Database

Anda perlu membuat database dan tabel yang dibutuhkan.

1.  Buka klien MySQL Anda (seperti MySQL Workbench).
2.  Buat database:

    ```sql
    CREATE DATABASE IF NOT EXISTS db_logistikku;
    ```
3.  Jalankan skrip SQL berikut untuk membuat tabel `tbl_users`, `tbl_barang`, `tbl_transaksi`, dan `tbl_transaksi_detail`:

    ```sql
    USE db_logistikku;

    CREATE TABLE tbl_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'staf'
    );

    CREATE TABLE tbl_barang (
        id INT AUTO_INCREMENT PRIMARY KEY,
        kode_barang VARCHAR(20) UNIQUE NOT NULL,
        nama_barang VARCHAR(100) NOT NULL,
        kategori VARCHAR(50),
        jumlah_stok INT DEFAULT 0,
        harga_beli DECIMAL(10, 2) DEFAULT 0.00,
        stok_minimal INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE tbl_transaksi (
        id INT AUTO_INCREMENT PRIMARY KEY,
        invoice_id VARCHAR(50) UNIQUE NOT NULL,
        customer_name VARCHAR(100) NOT NULL,
        total_price DECIMAL(15, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE tbl_transaksi_detail (
        id INT AUTO_INCREMENT PRIMARY KEY,
        transaksi_id INT,
        barang_id INT,
        jumlah INT NOT NULL,
        harga_saat_transaksi DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (transaksi_id) REFERENCES tbl_transaksi(id) ON DELETE CASCADE,
        FOREIGN KEY (barang_id) REFERENCES tbl_barang(id)
    );
    ```

### 4. Setup env

Ini adalah langkah penting untuk menghubungkan aplikasi ke database Anda.

1.  Di direktori utama proyek, temukan file `.env.local`.
2.  Buka file tersebut dan isi detail database MySQL Anda:

    ```ini
    DB_HOST=localhost
    DB_USER=nama_pengguna_mysql_anda
    DB_PASSWORD=kata_sandi_mysql_anda
    DB_DATABASE=db_logistikku
    ```

### 5. Jalankan Server 

Terakhir, jalankan perintah untuk memulai aplikasi.

```bash
npm run dev
```
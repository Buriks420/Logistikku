import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // 1. Find the user by username
    const [rows] = await pool.query('SELECT * FROM tbl_users WHERE username = ?', [username]);
    const users = rows as any[];

    if (users.length === 0) {
      // User not found
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    const user = users[0];

    // 2. Compare the provided password with the stored hash
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      // Password does not match
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    // 3. Login successful
    const { password: _, ...userWithoutPassword } = user; // Remove password from response
    return NextResponse.json({ message: 'Login successful', user: userWithoutPassword });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
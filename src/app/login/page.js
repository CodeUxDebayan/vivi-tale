import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import styles from './login.module.css';

export default async function LoginPage() {
  async function login(formData) {
    'use server';
    const password = formData.get('password');
    const validPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (password === validPassword) {
      const cookieStore = await cookies();
      cookieStore.set('adminAuth', password, { 
        secure: process.env.NODE_ENV === 'production', 
        httpOnly: true, 
        path: '/' 
      });
      redirect('/admin');
    }
  }

  return (
    <div className={styles.container}>
      <form action={login} className={styles.form}>
        <h1>Admin Access</h1>
        <input 
          type="password" 
          name="password" 
          placeholder="Enter password..." 
          required 
          className={styles.input} 
        />
        <button type="submit" className={styles.button}>Login</button>
      </form>
    </div>
  );
}

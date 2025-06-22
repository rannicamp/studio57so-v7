'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleLogin = async () => {
    setMessage('Fazendo login...');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`Erro ao logar: ${error.message}`);
    } else {
      setMessage('Login realizado com sucesso! Redirecionando...');
      router.push('/dashboard');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
        <input
          id="email"
          type="email"
          placeholder="seuemail@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: 'calc(100% - 20px)', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Senha:</label>
        <input
          id="password"
          type="password"
          placeholder="Sua senha secreta"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: 'calc(100% - 20px)', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>
      <button
        onClick={handleLogin}
        style={{ width: '100%', padding: '12px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
      >
        Login
      </button>
      {message && <p style={{ marginTop: '20px', textAlign: 'center', color: message.includes('Erro') ? 'red' : 'green' }}>{message}</p>}
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Não tem uma conta? <Link href="/auth/register" style={{ color: '#0070f3', textDecoration: 'none' }}>Crie uma agora</Link>
      </p>
    </div>
  );
}
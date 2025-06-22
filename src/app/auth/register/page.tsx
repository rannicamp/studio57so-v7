'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const supabase = createClientComponentClient();

  const handleRegister = async () => {
    setMessage('Registrando...');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Se você habilitou a confirmação de e-mail, adicione uma URL de redirecionamento.
        // Exemplo: redirectTo: `${location.origin}/auth/callback`,
        // Para simplificar, estamos sem redirecionamento aqui.
      },
    });

    if (error) {
      setMessage(`Erro ao registrar: ${error.message}`);
    } else {
      setMessage('Registro realizado com sucesso! Verifique seu email para confirmar (se a confirmação estiver ativada).');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Registrar</h2>
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
        onClick={handleRegister}
        style={{ width: '100%', padding: '12px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
      >
        Registrar
      </button>
      {message && <p style={{ marginTop: '20px', textAlign: 'center', color: message.includes('Erro') ? 'red' : 'green' }}>{message}</p>}
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Já tem uma conta? <Link href="/auth/login" style={{ color: '#0070f3', textDecoration: 'none' }}>Faça login</Link>
      </p>
    </div>
  );
}
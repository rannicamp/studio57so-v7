import '@/app/globals.css';
import type { Metadata } from 'next';
// 1. MUDANÇA AQUI: Importando a fonte correta 'Inter'
import { Inter } from 'next/font/google';

// 2. MUDANÇA AQUI: Configurando a fonte 'Inter'
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Dando um nome para a variável da fonte
});

export const metadata: Metadata = {
  title: 'Studio 57', // Mudei o título para algo mais relevante
  description: 'Aplicação de gerenciamento',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      {/* 3. MUDANÇA AQUI: Aplicando a classe da fonte 'Inter' no body */}
      <body className={`${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
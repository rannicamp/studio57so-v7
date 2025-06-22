// Conteúdo completo para o arquivo: lib/supabase/client.ts

import { createBrowserClient } from '@supabase/ssr';

// A palavra-chave 'export' é crucial aqui
export const createClientComponentClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
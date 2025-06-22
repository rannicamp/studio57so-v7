import { createServerClient, CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createSupabaseServerClient = () => {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const value = cookieStore.get(name)?.value;
          console.log(`[ServerClient:GET] Cookie '${name}':`, value ? 'Obtido' : 'Não encontrado'); // Log de depuração
          return value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            console.log(`[ServerClient:SET] Cookie '${name}':`, value); // Log de depuração
            cookieStore.set({ name, value, ...options });
          } catch (e) {
            console.error(`[ServerClient:SET ERROR] Cookie '${name}':`, e); // Log de erro
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            console.log(`[ServerClient:REMOVE] Cookie '${name}'`); // Log de depuração
            cookieStore.delete({ name, ...options });
          } catch (e) {
            console.error(`[ServerClient:REMOVE ERROR] Cookie '${name}':`, e); // Log de erro
          }
        },
      },
    }
  );
};
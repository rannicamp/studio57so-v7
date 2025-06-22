// Conteúdo completo para o arquivo: middleware.ts

import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  // Criamos uma resposta inicial que será usada e, se necessário, modificada.
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Criamos um cliente Supabase específico para o ambiente de middleware,
  // que sabe como ler e escrever cookies na requisição e na resposta.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Se um cookie for definido pelo Supabase, nós o adicionamos na resposta
          // que será enviada de volta para o navegador.
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          // Se um cookie for removido, fazemos o mesmo na resposta.
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // A função `getUser` é a forma recomendada para verificar a sessão no middleware.
  // Ela também atualiza o cookie da sessão se necessário.
  const { data: { user } } = await supabase.auth.getUser();

  // Se não houver usuário logado e a rota não for de autenticação,
  // redirecionamos para a página de login.
  if (!user && !request.nextUrl.pathname.startsWith('/auth')) {
    const loginUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Se tudo estiver certo, permitimos que a requisição continue,
  // retornando a resposta (que pode conter um cookie atualizado).
  return response;
}

// O `matcher` define em quais rotas o middleware será executado.
// Esta configuração está correta e não precisa de alteração.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
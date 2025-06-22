import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LogoutButton from '../components/LogoutButton';

export const metadata = {
  title: 'Dashboard | Área Restrita',
};

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Ação do servidor para lidar com a submissão do formulário
  const handleSaveContact = async (formData: FormData) => {
    'use server';

    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;

    if (!name) {
      console.error("Nome é obrigatório!");
      return;
    }

    const supabaseServer = createSupabaseServerClient();
    // CUIDADO: A tabela 'contatos_teste' deve existir no seu Supabase!
    const { error } = await supabaseServer.from('contatos_teste').insert([{ nome: name, telefone: phone }]);

    if (error) {
      console.error("Erro ao salvar contato:", error);
    } else {
      console.log("Contato salvo com sucesso!");
      redirect('/dashboard'); // Redireciona para o mesmo dashboard para "atualizar" a lista (simples)
    }
  };

  // Carregar contatos para exibir (sempre do servidor)
  const { data: contacts, error: fetchError } = await supabase.from('contatos_teste').select('*').order('created_at', { ascending: false });
  if (fetchError) {
    console.error("Erro ao carregar contatos:", fetchError);
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba', textAlign: 'center' }}>
      <h1 style={{ color: '#0070f3' }}>Bem-vindo ao Dashboard!</h1>
      <p style={{ fontSize: '18px', marginBottom: '20px' }}>Você está logado como: **{user.email}**</p>
      <p style={{ marginBottom: '30px' }}>Esta é uma página protegida, visível apenas para usuários autenticados.</p>

      <LogoutButton />

      <hr style={{ margin: '40px 0', borderColor: '#eee' }} />

      <h2>Formulário Básico de Contato</h2>
      <form action={handleSaveContact} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px', margin: '0 auto' }}>
        <label htmlFor="name" style={{ textAlign: 'left', fontWeight: 'bold' }}>Nome:</label>
        <input type="text" id="name" name="name" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />

        <label htmlFor="phone" style={{ textAlign: 'left', fontWeight: 'bold' }}>Telefone:</label>
        <input type="text" id="phone" name="phone" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />

        <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Salvar Contato</button>
      </form>

      <h3 style={{ marginTop: '40px' }}>Contatos Salvos</h3>
      <ul style={{ listStyle: 'none', padding: '0', textAlign: 'left' }}>
        {contacts && contacts.length > 0 ? (
          contacts.map((contact) => (
            <li key={contact.id} style={{ borderBottom: '1px dashed #eee', padding: '10px 0' }}>
              <strong>{contact.nome}</strong> - {contact.telefone || 'N/A'}
            </li>
          ))
        ) : (
              <li>Nenhum contato salvo ainda.</li>
            )}
          </ul>

        </div>
      );
    }
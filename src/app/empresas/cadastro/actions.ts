// Local do arquivo: src/app/empresas/cadastro/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server'; // Importa nosso conector
import { revalidatePath } from 'next/cache';

export async function saveEmpresa(formData: FormData) {
  const supabase = createClient();

  const empresaData = {
    cnpj: formData.get('cnpj') as string,
    razao_social: formData.get('razaoSocial') as string,
    nome_fantasia: formData.get('nomeFantasia') as string,
    inscricao_estadual: formData.get('inscricaoEstadual') as string,
    inscricao_municipal: formData.get('inscricaoMunicipal') as string,
    telefone: formData.get('telefone') as string,
    email: formData.get('email') as string,
    cep: formData.get('cep') as string,
    logradouro: formData.get('addressStreet') as string,
    numero: formData.get('addressNumber') as string,
    complemento: formData.get('addressComplement') as string,
bairro: formData.get('neighborhood') as string,
    cidade: formData.get('city') as string,
    estado: formData.get('state') as string,
    responsavel_legal: formData.get('responsavelLegal') as string,
  };

  const { data, error } = await supabase
    .from('empresas') // IMPORTANTE: Verifique se o nome da sua tabela é 'empresas'
    .insert([empresaData])
    .select();

  if (error) {
    console.error('Erro ao salvar no Supabase:', error);
    return { success: false, message: `Erro ao salvar empresa: ${error.message}` };
  }
  
  revalidatePath('/empresas/cadastro');
  return { success: true, message: 'Empresa salva com sucesso!' };
}
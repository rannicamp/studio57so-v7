'use server'; // Indica que este arquivo contém Server Actions

import { revalidatePath } from 'next/cache'; // Para revalidar o cache de rotas
import { createSupabaseServerClient } from '@/lib/supabase/server'; // Cliente Supabase para o servidor

export async function saveEmpresa(formData: FormData) {
  const supabase = createSupabaseServerClient(); // Cria uma instância do cliente Supabase no servidor
  
  // Captura os dados do FormData. O nome do campo deve corresponder ao atributo 'name' no input HTML
  // Estes nomes de variável local permanecem camelCase para facilitar a leitura no TypeScript,
  // mas serão mapeados para snake_case no objeto 'empresaData'.
  const cnpj = formData.get('cnpj') as string;
  const razaoSocial = formData.get('razaoSocial') as string;
  const nomeFantasia = formData.get('nomeFantasia') as string;
  const inscricaoEstadual = formData.get('inscricaoEstadual') as string;
  const inscricaoMunicipal = formData.get('inscricaoMunicipal') as string;
  const cep = formData.get('cep') as string;
  const addressStreet = formData.get('addressStreet') as string;
  const addressNumber = formData.get('addressNumber') as string;
  const addressComplement = formData.get('addressComplement') as string;
  const neighborhood = formData.get('neighborhood') as string;
  const city = formData.get('city') as string;
  const state = formData.get('state') as string;
  const telefone = formData.get('telefone') as string;
  const email = formData.get('email') as string;
  const responsavelLegal = formData.get('responsavelLegal') as string;

  // Validações básicas no servidor
  if (!cnpj || !razaoSocial || !addressStreet || !addressNumber || !neighborhood || !city || !state) {
    return { success: false, message: 'Por favor, preencha todos os campos obrigatórios (*).' };
  }

  // CNPJ limpo para salvar no banco e verificar unicidade
  const cnpjLimpo = cnpj.replace(/[^\d]+/g, '');
  if (!cnpjLimpo || cnpjLimpo.length !== 14) { 
    return { success: false, message: 'CNPJ inválido ou incompleto.' };
  }

  // Dados para inserir/atualizar na tabela 'cadastro_empresa'
  // CHAVES DO OBJETO AGORA EM snake_case para corresponder ao DB
  const empresaData = {
    cnpj: cnpjLimpo,
    razao_social: razaoSocial,
    nome_fantasia: nomeFantasia,
    inscricao_estadual: inscricaoEstadual,
    inscricao_municipal: inscricaoMunicipal,
    address_street: addressStreet,
    address_number: addressNumber,
    address_complement: addressComplement,
    cep: cep.replace(/\D/g, ''),
    city,
    state,
    neighborhood,
    telefone: telefone.replace(/[^\d]+/g, ''),
    email,
    responsavel_legal: responsavelLegal,
    // created_at será definido por DEFAULT NOW() no DB
  };

  try {
    // Tentar inserir ou atualizar (upsert) a empresa.
    // `onConflict: 'cnpj'` tentará atualizar o registro se um CNPJ já existente for fornecido.
    const { data, error } = await supabase
      .from('cadastro_empresa')
      .upsert(empresaData, { onConflict: 'cnpj' }) 
      .select(); // Retorna o registro salvo/atualizado

    if (error) {
      console.error('Erro no Server Action ao salvar empresa:', error);
      if (error.code === '23505' && error.constraint === 'cadastro_empresa_cnpj_key') {
          return { success: false, message: 'CNPJ já cadastrado. Utilize outro CNPJ ou edite o registro existente.' };
      }
      return { success: false, message: `Erro ao salvar empresa: ${error.message}` };
    }

    // Revalida o cache da rota '/empresas/cadastro' e qualquer rota que liste empresas
    // Isso força o Next.js a buscar os dados mais recentes na próxima requisição
    revalidatePath('/empresas/cadastro'); 
    
    return { success: true, message: 'Empresa salva com sucesso!' };

  } catch (err: any) {
    console.error('Erro inesperado na Server Action:', err);
    return { success: false, message: `Erro inesperado: ${err.message}` };
  }
}
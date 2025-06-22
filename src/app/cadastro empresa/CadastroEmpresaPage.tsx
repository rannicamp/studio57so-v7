// Importações necessárias para React e Supabase
import React, { useState, useEffect } from 'react';
// Presumindo que o seu projeto Next.js esteja configurado para resolver aliases como '@/'
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation'; // Este é um recurso do Next.js App Router
import LogoutButton from '../components/LogoutButton'; // Seu componente de logout

// Importações de componentes Shadcn/ui para um visual consistente
// Nota: Para usar esses componentes, você precisaria ter o Shadcn/ui configurado em seu projeto Next.js.
// Se não tiver, pode substituí-los por elementos HTML/Tailwind simples.
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

// Metadados para a página (título no navegador)
export const metadata = {
  title: 'Cadastro de Empresas | Studio 57',
};

// Componente principal da página de Cadastro de Empresa (Server Component)
export default async function CadastroEmpresaPage() {
  // Inicializa o cliente Supabase para o servidor
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Redireciona se o usuário não estiver autenticado
  if (!user) {
    redirect('/auth/login');
  }

  // Ação do servidor para lidar com a submissão do formulário de nova empresa
  const handleSaveEmpresa = async (formData) => {
    'use server'; // Indica que esta função será executada no servidor

    // Extrai os dados do formulário
    const cnpj = formData.get('cnpj');
    const razaoSocial = formData.get('razaoSocial');
    const nomeFantasia = formData.get('nomeFantasia');
    const inscricaoEstadual = formData.get('inscricaoEstadual');
    const inscricaoMunicipal = formData.get('inscricaoMunicipal');
    const addressStreet = formData.get('addressStreet');
    const addressNumber = formData.get('addressNumber');
    const addressComplement = formData.get('addressComplement');
    const cep = formData.get('cep');
    const city = formData.get('city');
    const state = formData.get('state');
    const neighborhood = formData.get('neighborhood');
    const telefone = formData.get('telefone');
    const email = formData.get('email');
    const responsavelLegal = formData.get('responsavelLegal');

    // Validação básica
    if (!cnpj || !razaoSocial) {
      console.error("CNPJ e Razão Social são obrigatórios!");
      return;
    }

    const supabaseServer = createSupabaseServerClient();

    // Insere os dados na tabela 'cadastro_empresa'
    const { error } = await supabaseServer.from('cadastro_empresa').insert({
      cnpj,
      razaoSocial,
      nomeFantasia,
      inscricaoEstadual,
      inscricaoMunicipal,
      addressStreet,
      addressNumber,
      addressComplement,
      cep,
      city,
      state,
      neighborhood,
      telefone,
      email,
      responsavelLegal,
    });

    if (error) {
      console.error("Erro ao salvar empresa:", error);
    } else {
      console.log("Empresa salva com sucesso!");
      // Redireciona para o mesmo dashboard para "atualizar" a lista
      redirect('/dashboard/empresas'); // Assumindo uma rota como /dashboard/empresas
    }
  };

  // Ação do servidor para lidar com a atualização de uma empresa existente
  const handleUpdateEmpresa = async (formData) => {
    'use server';

    const id = formData.get('id'); // ID da empresa a ser atualizada
    const cnpj = formData.get('cnpj');
    const razaoSocial = formData.get('razaoSocial');
    const nomeFantasia = formData.get('nomeFantasia');
    const inscricaoEstadual = formData.get('inscricaoEstadual');
    const inscricaoMunicipal = formData.get('inscricaoMunicipal');
    const addressStreet = formData.get('addressStreet');
    const addressNumber = formData.get('addressNumber');
    const addressComplement = formData.get('addressComplement');
    const cep = formData.get('cep');
    const city = formData.get('city');
    const state = formData.get('state');
    const neighborhood = formData.get('neighborhood');
    const telefone = formData.get('telefone');
    const email = formData.get('email');
    const responsavelLegal = formData.get('responsavelLegal');

    if (!id || !cnpj || !razaoSocial) {
      console.error("ID, CNPJ e Razão Social são obrigatórios para atualização!");
      return;
    }

    const supabaseServer = createSupabaseServerClient();
    const { error } = await supabaseServer.from('cadastro_empresa').update({
      cnpj,
      razaoSocial,
      nomeFantasia,
      inscricaoEstadual,
      inscricaoMunicipal,
      addressStreet,
      addressNumber,
      addressComplement,
      cep,
      city,
      state,
      neighborhood,
      telefone,
      email,
      responsavelLegal,
    }).eq('id', id); // Condição para atualizar pelo ID

    if (error) {
      console.error("Erro ao atualizar empresa:", error);
    } else {
      console.log("Empresa atualizada com sucesso!");
      redirect('/dashboard/empresas');
    }
  };

  // Ação do servidor para lidar com a exclusão de uma empresa
  const handleDeleteEmpresa = async (formData) => {
    'use server';

    const id = formData.get('id'); // ID da empresa a ser excluída

    if (!id) {
      console.error("ID da empresa é obrigatório para exclusão!");
      return;
    }

    const supabaseServer = createSupabaseServerClient();
    const { error } = await supabaseServer.from('cadastro_empresa').delete().eq('id', id);

    if (error) {
      console.error("Erro ao excluir empresa:", error);
    } else {
      console.log("Empresa excluída com sucesso!");
      redirect('/dashboard/empresas');
    }
  };

  // Carregar lista de empresas para exibição
  const { data: empresas, error: fetchError } = await supabase
    .from('cadastro_empresa')
    .select('*')
    .order('razaoSocial', { ascending: true }); // Ordena por Razão Social

  if (fetchError) {
    console.error("Erro ao carregar empresas:", fetchError);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Cabeçalho da Página */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Cadastro de Empresas</h1>
        <LogoutButton />
      </div>

      {/* Formulário de Nova Empresa */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Nova Empresa</CardTitle>
          <CardDescription>Preencha os dados para cadastrar uma nova empresa.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSaveEmpresa} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CNPJ */}
            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input id="cnpj" name="cnpj" required placeholder="00.000.000/0000-00" />
            </div>
            {/* Razão Social */}
            <div>
              <Label htmlFor="razaoSocial">Razão Social</Label>
              <Input id="razaoSocial" name="razaoSocial" required placeholder="Nome Completo da Empresa" />
            </div>
            {/* Nome Fantasia */}
            <div>
              <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
              <Input id="nomeFantasia" name="nomeFantasia" placeholder="Nome de Marca" />
            </div>
            {/* Inscrição Estadual */}
            <div>
              <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
              <Input id="inscricaoEstadual" name="inscricaoEstadual" placeholder="Ex: 123.456.789.112" />
            </div>
            {/* Inscrição Municipal */}
            <div>
              <Label htmlFor="inscricaoMunicipal">Inscrição Municipal</Label>
              <Input id="inscricaoMunicipal" name="inscricaoMunicipal" placeholder="Ex: 000.111.222" />
            </div>
            {/* Rua/Avenida */}
            <div>
              <Label htmlFor="addressStreet">Rua/Avenida</Label>
              <Input id="addressStreet" name="addressStreet" placeholder="Ex: Rua Principal" />
            </div>
            {/* Número Endereço */}
            <div>
              <Label htmlFor="addressNumber">Número</Label>
              <Input id="addressNumber" name="addressNumber" placeholder="Ex: 123" />
            </div>
            {/* Complemento Endereço */}
            <div>
              <Label htmlFor="addressComplement">Complemento</Label>
              <Input id="addressComplement" name="addressComplement" placeholder="Ex: Apto 101" />
            </div>
            {/* CEP */}
            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input id="cep" name="cep" placeholder="00000-000" />
            </div>
            {/* Cidade */}
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" name="city" placeholder="Ex: Belo Horizonte" />
            </div>
            {/* Estado (UF) - Input que estava faltando */}
            <div>
              <Label htmlFor="state">Estado (UF)</Label>
              <Input id="state" name="state" placeholder="Ex: MG" maxLength={2} />
            </div>
            {/* Bairro */}
            <div>
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input id="neighborhood" name="neighborhood" placeholder="Ex: Centro" />
            </div>
            {/* Telefone */}
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" name="telefone" placeholder="(XX) XXXX-XXXX" />
            </div>
            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="contato@empresa.com" />
            </div>
            {/* Responsável Legal */}
            <div>
              <Label htmlFor="responsavelLegal">Responsável Legal</Label>
              <Input id="responsavelLegal" name="responsavelLegal" placeholder="Nome do Responsável" />
            </div>

            {/* Botão de Submissão */}
            <div className="col-span-1 md:col-span-2 flex justify-end">
              <Button type="submit">Salvar Empresa</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de Empresas Cadastradas */}
      <Card>
        <CardHeader>
          <CardTitle>Empresas Cadastradas</CardTitle>
          <CardDescription>Visualize, edite ou exclua empresas existentes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Razão Social</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {empresas && empresas.length > 0 ? (
                empresas.map((empresa) => (
                  <TableRow key={empresa.id}>
                    <TableCell className="font-medium">{empresa.razaoSocial}</TableCell>
                    <TableCell>{empresa.cnpj}</TableCell>
                    <TableCell>{empresa.telefone || 'N/A'}</TableCell>
                    <TableCell>{empresa.email || 'N/A'}</TableCell>
                    <TableCell className="text-right flex gap-2 justify-end">
                      {/* Botão de Editar (abre modal de edição) */}
                      {/*
                        Você precisará implementar um modal ou um formulário de edição
                        separado para esta funcionalidade, que pré-popule os campos
                        com os dados da empresa selecionada.
                      */}
                      <EditCompanyModal empresa={empresa} onUpdate={handleUpdateEmpresa} />

                      {/* Botão de Excluir */}
                      <form action={handleDeleteEmpresa}>
                        <input type="hidden" name="id" value={empresa.id} />
                        <Button variant="destructive" size="sm" type="submit">Excluir</Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Nenhuma empresa cadastrada ainda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


// Componente de Modal de Edição (Client Component)
// Este componente é um exemplo de como um modal de edição poderia funcionar.
// Ele é marcado com 'use client' porque usa hooks de estado (useState, useEffect).
const EditCompanyModal = ({ empresa, onUpdate }) => {
  'use client'; // Marca este componente como um Client Component

  const [isOpen, setIsOpen] = useState(false); // Estado para controlar a abertura do modal

  // Estado local para os dados do formulário de edição
  // Inicializa com os dados da empresa passada como prop
  const [formData, setFormData] = useState({
    id: empresa.id,
    cnpj: empresa.cnpj,
    razaoSocial: empresa.razaoSocial,
    nomeFantasia: empresa.nomeFantasia || '',
    inscricaoEstadual: empresa.inscricaoEstadual || '',
    inscricaoMunicipal: empresa.inscricaoMunicipal || '',
    addressStreet: empresa.addressStreet || '',
    addressNumber: empresa.addressNumber || '',
    addressComplement: empresa.addressComplement || '',
    cep: empresa.cep || '',
    city: empresa.city || '',
    state: empresa.state || '',
    neighborhood: empresa.neighborhood || '',
    telefone: empresa.telefone || '',
    email: empresa.email || '',
    responsavelLegal: empresa.responsavelLegal || '',
  });

  // useEffect para garantir que o formulário é resetado se a empresa mudar
  useEffect(() => {
    setFormData({
      id: empresa.id,
      cnpj: empresa.cnpj,
      razaoSocial: empresa.razaoSocial,
      nomeFantasia: empresa.nomeFantasia || '',
      inscricaoEstadual: empresa.inscricaoEstadual || '',
      inscricaoMunicipal: empresa.inscricaoMunicipal || '',
      addressStreet: empresa.addressStreet || '',
      addressNumber: empresa.addressNumber || '',
      addressComplement: empresa.addressComplement || '',
      cep: empresa.cep || '',
      city: empresa.city || '',
      state: empresa.state || '',
      neighborhood: empresa.neighborhood || '',
      telefone: empresa.telefone || '',
      email: empresa.email || '',
      responsavelLegal: empresa.responsavelLegal || '',
    });
  }, [empresa]);

  // Função para lidar com a mudança nos inputs do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Função para lidar com o envio do formulário de atualização
  const handleSubmit = async (event) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    // Chama a ação do servidor para atualizar, passada via prop
    await onUpdate(data);
    setIsOpen(false); // Fecha o modal após a atualização
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>Editar</Button>
      <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]"> {/* Ajusta tamanho e scroll */}
        <DialogHeader>
          <DialogTitle>Editar Empresa: {empresa.razaoSocial}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <input type="hidden" name="id" value={formData.id} />
          {/* CNPJ */}
          <div>
            <Label htmlFor="edit-cnpj">CNPJ</Label>
            <Input id="edit-cnpj" name="cnpj" value={formData.cnpj} onChange={handleChange} required />
          </div>
          {/* Razão Social */}
          <div>
            <Label htmlFor="edit-razaoSocial">Razão Social</Label>
            <Input id="edit-razaoSocial" name="razaoSocial" value={formData.razaoSocial} onChange={handleChange} required />
          </div>
          {/* Nome Fantasia */}
          <div>
            <Label htmlFor="edit-nomeFantasia">Nome Fantasia</Label>
            <Input id="edit-nomeFantasia" name="nomeFantasia" value={formData.nomeFantasia} onChange={handleChange} />
          </div>
          {/* Inscrição Estadual */}
          <div>
            <Label htmlFor="edit-inscricaoEstadual">Inscrição Estadual</Label>
            <Input id="edit-inscricaoEstadual" name="inscricaoEstadual" value={formData.inscricaoEstadual} onChange={handleChange} />
          </div>
          {/* Inscrição Municipal */}
          <div>
            <Label htmlFor="edit-inscricaoMunicipal">Inscrição Municipal</Label>
            <Input id="edit-inscricaoMunicipal" name="inscricaoMunicipal" value={formData.inscricaoMunicipal} onChange={handleChange} />
          </div>
          {/* Rua/Avenida */}
          <div>
            <Label htmlFor="edit-addressStreet">Rua/Avenida</Label>
            <Input id="edit-addressStreet" name="addressStreet" value={formData.addressStreet} onChange={handleChange} />
          </div>
          {/* Número Endereço */}
          <div>
            <Label htmlFor="edit-addressNumber">Número</Label>
            <Input id="edit-addressNumber" name="addressNumber" value={formData.addressNumber} onChange={handleChange} />
          </div>
          {/* Complemento Endereço */}
          <div>
            <Label htmlFor="edit-addressComplement">Complemento</Label>
            <Input id="edit-addressComplement" name="addressComplement" value={formData.addressComplement} onChange={handleChange} />
          </div>
          {/* CEP */}
          <div>
            <Label htmlFor="edit-cep">CEP</Label>
            <Input id="edit-cep" name="cep" value={formData.cep} onChange={handleChange} />
          </div>
          {/* Cidade */}
          <div>
            <Label htmlFor="edit-city">Cidade</Label>
            <Input id="edit-city" name="city" value={formData.city} onChange={handleChange} />
          </div>
          {/* Estado (UF) */}
          <div>
            <Label htmlFor="edit-state">Estado (UF)</Label>
            <Input id="edit-state" name="state" value={formData.state} onChange={handleChange} maxLength={2} />
          </div>
          {/* Bairro */}
          <div>
            <Label htmlFor="edit-neighborhood">Bairro</Label>
            <Input id="edit-neighborhood" name="neighborhood" value={formData.neighborhood} onChange={handleChange} />
          </div>
          {/* Telefone */}
          <div>
            <Label htmlFor="edit-telefone">Telefone</Label>
            <Input id="edit-telefone" name="telefone" value={formData.telefone} onChange={handleChange} />
          </div>
          {/* Email */}
          <div>
            <Label htmlFor="edit-email">Email</Label>
            <Input id="edit-email" name="email" type="email" value={formData.email} onChange={handleChange} />
          </div>
          {/* Responsável Legal */}
          <div>
            <Label htmlFor="edit-responsavelLegal">Responsável Legal</Label>
            <Input id="edit-responsavelLegal" name="responsavelLegal" value={formData.responsavelLegal} onChange={handleChange} />
          </div>
          {/* Botões do modal */}
          <DialogFooter className="col-span-1 md:col-span-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button type="submit">Salvar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

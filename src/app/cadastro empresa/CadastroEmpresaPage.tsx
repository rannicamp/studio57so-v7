'use client';

import { useState } from 'react';
import { saveEmpresa } from './actions';

export default function CadastroEmpresaPage() {
  const [cnpj, setCnpj] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [inscricaoEstadual, setInscricaoEstadual] = useState('');
  const [inscricaoMunicipal, setInscricaoMunicipal] = useState('');
  const [cep, setCep] = useState('');
  const [addressStreet, setAddressStreet] = useState(''); 
  const [addressNumber, setAddressNumber] = useState(''); 
  const [addressComplement, setAddressComplement] = useState(''); 
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [responsavelLegal, setResponsavelLegal] = useState(''); 
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('Salvando empresa...');
    
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const result = await saveEmpresa(formData);

    if (result.success) {
      setMessage(result.message);
      (event.currentTarget as HTMLFormElement).reset(); // Limpa o formulário
    } else {
      setMessage(`Erro: ${result.message}`);
    }
    setIsSubmitting(false);
  };

  return (
    // Classes padrão do Tailwind para o layout principal
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Card principal com estilos padrão */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Cadastro de Empresas</h1>
        
        {message && (
          <div className="p-3 mb-4 text-center rounded-md bg-blue-100 text-blue-800">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Inputs com classes de estilo padrão do Tailwind */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Dados da Empresa</h2>
          </div>
          
          <div>
            <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">CNPJ *</label>
            <input type="text" id="cnpj" name="cnpj" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
          </div>

          <div>
            <label htmlFor="razaoSocial" className="block text-sm font-medium text-gray-700">Razão Social *</label>
            <input type="text" id="razaoSocial" name="razaoSocial" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
          </div>

          {/* Repita o padrão de classes para todos os outros inputs... */}
          {/* Exemplo para Nome Fantasia */}
          <div>
            <label htmlFor="nomeFantasia" className="block text-sm font-medium text-gray-700">Nome Fantasia</label>
            <input type="text" id="nomeFantasia" name="nomeFantasia" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          
          {/* ... e assim por diante para todos os campos ... */}

          <div className="md:col-span-2 flex justify-center gap-4 mt-6">
            <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md disabled:opacity-50">
              {isSubmitting ? 'Salvando...' : 'Salvar Empresa'}
            </button>
            <button type="reset" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-md">
              Limpar Formulário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
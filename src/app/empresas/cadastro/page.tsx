'use client';

import { useState } from 'react';
import { saveEmpresa } from './actions'; // Esta linha espera que 'actions.ts' esteja na mesma pasta.

export default function CadastroEmpresaPage() {
  // Estados para todos os campos do formulário
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
  
  // Estados para controle da UI
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função para lidar com o envio do formulário
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('Salvando empresa...');
    
    const formData = new FormData(event.currentTarget);
    const result = await saveEmpresa(formData);

    if (result.success) {
      setMessage(result.message);
      // Limpa todos os campos do formulário após o sucesso
      setCnpj('');
      setRazaoSocial('');
      setNomeFantasia('');
      setInscricaoEstadual('');
      setInscricaoMunicipal('');
      setCep('');
      setAddressStreet('');
      setAddressNumber('');
      setAddressComplement('');
      setNeighborhood('');
      setCity('');
      setState('');
      setTelefone('');
      setEmail('');
      setResponsavelLegal('');
    } else {
      setMessage(`Erro: ${result.message}`);
    }
    setIsSubmitting(false);
  };

  // Estilo padrão para todos os inputs de texto, para manter a consistência
  const inputClassName = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Cadastro de Empresas</h1>
        
        {message && (
          <div className="p-4 mb-6 text-center rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Dados da Empresa</h2>
          </div>
          
          <div>
            <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">CNPJ *</label>
            <input type="text" id="cnpj" name="cnpj" value={cnpj} onChange={(e) => setCnpj(e.target.value)} className={inputClassName} required />
          </div>

          <div>
            <label htmlFor="razaoSocial" className="block text-sm font-medium text-gray-700">Razão Social *</label>
            <input type="text" id="razaoSocial" name="razaoSocial" value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)} className={inputClassName} required />
          </div>

          <div>
            <label htmlFor="nomeFantasia" className="block text-sm font-medium text-gray-700">Nome Fantasia</label>
            <input type="text" id="nomeFantasia" name="nomeFantasia" value={nomeFantasia} onChange={(e) => setNomeFantasia(e.target.value)} className={inputClassName} />
          </div>
          
          <div>
            <label htmlFor="inscricaoEstadual" className="block text-sm font-medium text-gray-700">Inscrição Estadual</label>
            <input type="text" id="inscricaoEstadual" name="inscricaoEstadual" value={inscricaoEstadual} onChange={(e) => setInscricaoEstadual(e.target.value)} className={inputClassName} />
          </div>

          <div>
            <label htmlFor="inscricaoMunicipal" className="block text-sm font-medium text-gray-700">Inscrição Municipal</label>
            <input type="text" id="inscricaoMunicipal" name="inscricaoMunicipal" value={inscricaoMunicipal} onChange={(e) => setInscricaoMunicipal(e.target.value)} className={inputClassName} />
          </div>

          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone</label>
            <input type="tel" id="telefone" name="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} className={inputClassName} />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClassName} />
          </div>

          <div className="md:col-span-2 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Endereço da Empresa</h2>
          </div>

          <div>
            <label htmlFor="cep" className="block text-sm font-medium text-gray-700">CEP *</label>
            <input type="text" id="cep" name="cep" value={cep} onChange={(e) => setCep(e.target.value)} className={inputClassName} required />
          </div>

          <div>
            <label htmlFor="addressStreet" className="block text-sm font-medium text-gray-700">Logradouro (Rua/Av.) *</label>
            <input type="text" id="addressStreet" name="addressStreet" value={addressStreet} onChange={(e) => setAddressStreet(e.target.value)} className={inputClassName} required />
          </div>

          <div>
            <label htmlFor="addressNumber" className="block text-sm font-medium text-gray-700">Número *</label>
            <input type="text" id="addressNumber" name="addressNumber" value={addressNumber} onChange={(e) => setAddressNumber(e.target.value)} className={inputClassName} required />
          </div>

          <div>
            <label htmlFor="addressComplement" className="block text-sm font-medium text-gray-700">Complemento</label>
            <input type="text" id="addressComplement" name="addressComplement" value={addressComplement} onChange={(e) => setAddressComplement(e.target.value)} className={inputClassName} />
          </div>

          <div>
            <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">Bairro *</label>
            <input type="text" id="neighborhood" name="neighborhood" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} className={inputClassName} required />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">Cidade *</label>
            <input type="text" id="city" name="city" value={city} onChange={(e) => setCity(e.target.value)} className={inputClassName} required />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">Estado (UF) *</label>
            <input type="text" id="state" name="state" value={state} onChange={(e) => setState(e.target.value)} className={inputClassName} required />
          </div>

          <div className="md:col-span-2 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Informações Adicionais</h2>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="responsavelLegal" className="block text-sm font-medium text-gray-700">Responsável Legal</label>
            <input type="text" id="responsavelLegal" name="responsavelLegal" value={responsavelLegal} onChange={(e) => setResponsavelLegal(e.target.value)} className={inputClassName} />
          </div>

          <div className="md:col-span-2 flex justify-center gap-4 mt-8">
            <button type="submit" disabled={isSubmitting} className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50 transition-colors">
              {isSubmitting ? 'Salvando...' : 'Salvar Empresa'}
            </button>
            <button type="reset" className="w-full md:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-lg transition-colors">
              Limpar Formulário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
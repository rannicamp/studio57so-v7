'use client'; // Indica que este é um componente do lado do cliente

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@/lib/supabase/client'; // Cliente Supabase para o navegador

// Importa a Server Action para salvar a empresa
import { saveEmpresa } from './actions'; 

export default function CadastroEmpresaPage() {
  // Estados para os campos do formulário (mantidos em camelCase para convenção React/TS)
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

  // Estados para feedback e status do CEP
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'
  const [cepStatus, setCepStatus] = useState(''); // Status da busca de CEP
  const [isSubmitting, setIsSubmitting] = useState(false); // Controle do estado de envio do formulário

  // Inicializa o cliente Supabase (usado aqui para a busca de CEP)
  const supabase = createClientComponentClient(); 

  // Função auxiliar para mostrar feedback ao usuário na tela
  const showFeedback = (msg: string, type: string) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000); // Mensagem desaparece após 5 segundos
  };

  // Funções de Formatação e Validação (adaptadas do seu JS original)
  const formatCnpj = (value: string) => {
    const cleaned = value.replace(/[^\d]+/g, '');
    if (cleaned.length > 14) return cleaned.substring(0, 14).replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  };

  const validateCnpj = (cnpjValue: string): boolean => {
    cnpjValue = cnpjValue.replace(/[^\d]+/g, '');
    if (cnpjValue.length !== 14 || /^(\d)\1{13}$/.test(cnpjValue)) return false;
    let tamanho = cnpjValue.length - 2;
    let numeros = cnpjValue.substring(0, tamanho);
    const digitos = cnpjValue.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) { soma += parseInt(numeros.charAt(tamanho - i)) * pos--; if (pos < 2) pos = 9; }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;
    tamanho = tamanho + 1;
    numeros = cnpjValue.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) { soma += parseInt(numeros.charAt(tamanho - i)) * pos--; if (pos < 2) pos = 9; }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return resultado === parseInt(digitos.charAt(1));
  };

  const formatTelefone = (value: string) => {
    const cleaned = value.replace(/[^\d]+/g, '');
    if (cleaned.length === 11) return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    if (cleaned.length === 10) return cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    return cleaned;
  };

  // Limpa os campos do formulário
  const clearFormFields = () => {
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
    setMessage('');
    setMessageType('');
    setCepStatus('');
  };

  // Efeito para buscar endereço automaticamente via ViaCEP quando o CEP muda
  useEffect(() => {
    const fetchAddress = async () => {
      const cleanedCep = cep.replace(/\D/g, '');
      if (cleanedCep.length !== 8) {
        setCepStatus('');
        clearFormFields(); 
        return;
      }

      setCepStatus('Buscando...');
      
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
        if (!response.ok) throw new Error('Falha na consulta do ViaCEP.');
        const data = await response.json();

        if (data.erro) throw new Error('CEP não encontrado.');

        setAddressStreet(data.logradouro || ''); 
        setNeighborhood(data.bairro || '');
        setCity(data.localidade || '');
        setState(data.uf || '');
        setCepStatus('Endereço encontrado!');
        showFeedback('Endereço encontrado!', 'success');
        document.getElementById('addressNumber')?.focus();

      } catch (error: any) {
        console.error('Erro ao buscar CEP:', error);
        setCepStatus(`Erro: ${error.message}`);
        showFeedback(`Erro ao buscar CEP: ${error.message}`, 'error');
        clearFormFields(); 
      }
    };

    const handler = setTimeout(() => {
      fetchAddress();
    }, 500); 

    return () => clearTimeout(handler); 
  }, [cep]); 

  // Função para lidar com a submissão do formulário
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); 
    setMessage('');
    setMessageType('');
    setIsSubmitting(true); // Desativa o botão e mostra "Salvando..."

    console.log('[Submit] Iniciando processo de salvamento...'); 

    // Validação básica do lado do cliente
    const validationErrors: string[] = [];
    if (!cnpj || !razaoSocial || !addressStreet || !addressNumber || !neighborhood || !city || !state) {
      validationErrors.push('Todos os campos obrigatórios (*) devem ser preenchidos.');
    }
    if (cnpj && !validateCnpj(cnpj)) { 
      validationErrors.push('CNPJ inválido. Por favor, verifique.');
    }

    if (validationErrors.length > 0) {
      showFeedback(validationErrors.join(' '), 'error');
      setIsSubmitting(false); // Reativa o botão em caso de erro de validação cliente-side
      return;
    }

    showFeedback('Salvando empresa...', 'info');

    // Criar um FormData para enviar os dados para a Server Action
    const formData = new FormData(event.currentTarget as HTMLFormElement);

    try {
      console.log('[Submit] Chamando Server Action saveEmpresa...'); 
      const result = await saveEmpresa(formData); // Chama a Server Action
      console.log('[Submit] Resultado da Server Action:', result); 

      if (!result.success) {
        showFeedback(`Erro: ${result.message}`, 'error');
      } else {
        showFeedback(result.message, 'success');
        clearFormFields(); // Limpar formulário após sucesso
      }
    } catch (err: any) {
      console.error('[Submit] Erro inesperado ao chamar Server Action:', err); 
      showFeedback(`Erro inesperado: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false); // Sempre reativa o botão no final do processo
      console.log('[Submit] Processo de salvamento finalizado.'); 
    }
  };

  // Função para limpar o formulário (conectada ao botão Reset)
  const handleReset = () => {
    clearFormFields();
  };


  return (
    <div className="page-container flex items-center justify-center py-8"> {/* Usando classe page-container */}
      <div className="section-card max-w-4xl w-full"> {/* Usando classe section-card */}
        <h1 className="text-2xl font-bold text-center text-studio-dark mb-6">Cadastro de Empresas</h1>
        
        {/* Mensagem de Feedback */}
        {message && (
          <div className={`p-3 mb-4 text-center rounded-md ${messageType === 'success' ? 'bg-studio-success text-studio-dark' : 'bg-studio-danger text-studio-white'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Dados da Empresa */}
          <div className="md:col-span-2">
            <h2 className="section-title">Dados da Empresa</h2> {/* Usando classe section-title */}
          </div>
          <div className="form-group">
            <label htmlFor="cnpj" className="block text-sm font-bold text-studio-dark mb-1">CNPJ <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="cnpj"
              name="cnpj" // Atributo name crucial para FormData
              className="w-full px-3 py-2 border rounded-md border-studio-medium-light-gray focus:outline-none focus:ring-2 focus:ring-studio-primary-dark focus:border-transparent"
              placeholder="00.000.000/0000-00"
              value={cnpj}
              onChange={(e) => setCnpj(formatCnpj(e.target.value))}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="razaoSocial" className="block text-sm font-bold text-studio-dark mb-1">Razão Social <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="razaoSocial"
              name="razaoSocial" // Atributo name crucial para FormData
              className="w-full px-3 py-2 border rounded-md border-studio-medium-light-gray focus:outline-none focus:ring-2 focus:ring-studio-primary-dark focus:border-transparent"
              value={razaoSocial}
              onChange={(e) => setRazaoSocial(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="nomeFantasia" className="block text-sm font-bold text-studio-dark mb-1">Nome Fantasia</label>
            <input
              type="text"
              id="nomeFantasia"
              name="nomeFantasia" // Atributo name crucial para FormData
              className="w-full px-3 py-2 border rounded-md border-studio-medium-light-gray focus:outline-none focus:ring-2 focus:ring-studio-primary-dark focus:border-transparent"
              value={nomeFantasia}
              onChange={(e) => setNomeFantasia(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="inscricaoEstadual" className="block text-sm font-bold text-studio-dark mb-1">Inscrição Estadual</label>
            <input
              type="text"
              id="inscricaoEstadual"
              name="inscricaoEstadual" // Atributo name crucial para FormData
              className="w-full px-3 py-2 border rounded-md border-studio-medium-light-gray focus:outline-none focus:ring-2 focus:ring-studio-primary-dark focus:border-transparent"
              value={inscricaoEstadual}
              onChange={(e) => setInscricaoEstadual(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="inscricaoMunicipal" className="block text-sm font-bold text-studio-dark mb-1">Inscrição Municipal</label>
            <input
              type="text"
              id="inscricaoMunicipal"
              name="inscricaoMunicipal" // Atributo name crucial para FormData
              className="w-full px-3 py-2 border rounded-md border-studio-medium-light-gray focus:outline-none focus:ring-2 focus:ring-studio-primary-dark focus:border-transparent"
              value={inscricaoMunicipal}
              onChange={(e) => setInscricaoMunicipal(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="telefone" className="block text-sm font-bold text-studio-dark mb-1">Telefone</label>
            <input
              type="tel"
              id="telefone"
              name="telefone" // Atributo name crucial para FormData
              className="w-full px-3 py-2 border rounded-md border-studio-medium-light-gray focus:outline-none focus:ring-2 focus:ring-studio-primary-dark focus:border-transparent"
              placeholder="(00) 00000-0000"
              value={telefone}
              onChange={(e) => setTelefone(formatTelefone(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="block text-sm font-bold text-studio-dark mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email" // Atributo name crucial para FormData
              className="w-full px-3 py-2 border rounded-md border-studio-medium-light-gray focus:outline-none focus:ring-2 focus:ring-studio-primary-dark focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Endereço da Empresa */}
          <div className="md:col-span-2">
            <h2 className="section-title mt-6">Endereço da Empresa</h2> {/* Usando classe section-title */}
          </div>
          <div className="form-group md:col-span-2">
            <label htmlFor="cep" className="block text-sm font-bold text-studio-dark mb-1">CEP <span className="text-red-500">*</span></label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="cep"
                name="cep" // Atributo name crucial para FormData
                className="w-full px-3 py-2 border rounded-md border-studio-medium-light-gray focus:outline-none focus:ring-2 focus:ring-studio-primary-dark focus:border-transparent"
                placeholder="00000-000"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                maxLength={9}
                required
              />
              <button
                type="button"
                onClick={() => setCep(cep)} 
                className="bg-studio-info text-studio-white py-2 px-4 whitespace-nowrap rounded-md font-semibold hover:bg-studio-info-dark transition-colors duration-300"
                disabled={isSubmitting} 
              >
                Buscar CEP
              </button>
            </div>
            {cepStatus && <p className="text-sm text-studio-info mt-1">{cepStatus}</p>}
          </div>
          <div className="form-group md:col-span-2">
            <label htmlFor="addressStreet" className="block text-sm font-bold text-studio-dark mb-1">Logradouro (Rua/Av.) <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="addressStreet"
              name="addressStreet" // Atributo name crucial para FormData
              className="w-full px-3 py-2 border rounded-md border-studio-medium-light-gray focus:outline-none focus:ring-2 focus:ring-studio-primary-dark focus:border-transparent"
              value={addressStreet}
              onChange={(e) => setAddressStreet(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="addressNumber" className="block text-sm font-bold text-studio-dark mb-1">Número <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="addressNumber"
              name="addressNumber" // Atributo name crucial para FormData
              className="w-full px-3 py-2 border rounded-md border-studio-medium-light-gray focus:outline-none focus:ring-2 focus:ring-studio-primary-dark focus:border-transparent"
              value={addressNumber}
              onChange={(e) => setAddressNumber(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="addressComplement" className="block text-sm font-bold text-studio-dark mb-1">Complemento</label>
            <input
              type="text"
              id="addressComplement"
              name="addressComplement" // Atributo name crucial para FormData
              className="w-full px-3 py-2 border rounded-md border-studio-medium-light-gray focus:outline-none focus:ring-2 focus:ring-studio-primary-dark focus:border-transparent"
              placeholder="Apto, Bloco, etc."
              value={addressComplement}
              onChange={(e) => setAddressComplement(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="neighborhood" className="block text-sm font-bold text-studio-dark mb-1">Bairro <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="neighborhood"
              name="neighborhood" // Atributo name crucial para FormData
              className="w-full px-3 py-2 border rounded-md border-studio-medium-light-gray focus:outline-none focus:ring-2 focus:ring-studio-primary-dark focus:border-transparent"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="city" className="block text-sm font-bold text-studio-dark mb-1">Cidade <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="city"
              name="city" // Atributo name crucial para FormData
              className="w-full px-3 py-2 border rounded-md border-studio-medium-light-gray focus:outline-none focus:ring-2 focus:ring-studio-primary-dark focus:border-transparent"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="state" className="block text-sm font-bold text-studio-dark mb-1">Estado (UF) <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="state"
              name="state" // Atributo name crucial para FormData
              className="w-full px-3 py-2 border rounded-md border-studio-medium-light-gray focus:outline-none focus:ring-2 focus:ring-studio-primary-dark focus:border-transparent"
              value={state}
              onChange={(e) => setState(e.target.value)}
              maxLength={2}
              required
            />
          </div>

          {/* Informações Adicionais */}
          <div className="md:col-span-2">
            <h2 className="section-title mt-6">Informações Adicionais</h2> {/* Usando classe section-title */}
          </div>
          <div className="form-group md:col-span-2">
            <label htmlFor="responsavelLegal" className="block text-sm font-bold text-studio-dark mb-1">Responsável Legal</label>
            <input
              type="text"
              id="responsavelLegal"
              name="responsavelLegal" // Atributo name crucial para FormData
              className="w-full px-3 py-2 border rounded-md border-studio-medium-light-gray focus:outline-none focus:ring-2 focus:ring-studio-primary-dark focus:border-transparent"
              value={responsavelLegal}
              onChange={(e) => setResponsavelLegal(e.target.value)}
            />
          </div>

          {/* Botões de Ação */}
          <div className="md:col-span-2 flex justify-center gap-4 mt-6">
            <button
              type="submit"
              className="bg-studio-success text-studio-dark py-3 px-6 rounded-md font-semibold hover:bg-studio-success-dark transition-colors duration-300"
              disabled={isSubmitting} // Desativa o botão enquanto salvando
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Empresa'}
            </button>
            <button
              type="reset"
              onClick={handleReset} 
              className="bg-studio-medium-light-gray text-studio-dark py-3 px-6 rounded-md font-semibold hover:bg-studio-dark-gray hover:text-studio-white transition-colors duration-300"
              disabled={isSubmitting} // Desativa o botão enquanto salvando
            >
              Limpar Formulário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

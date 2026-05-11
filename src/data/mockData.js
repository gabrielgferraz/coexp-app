export const MOCK_INSUMOS = [
    { id: '1', nome: 'Insumo A', qtd: 34, unidade: 'Litros' },
    { id: '2', nome: 'Insumo B', qtd: 2,  unidade: 'Un' },
    { id: '3', nome: 'Insumo C', qtd: 10, unidade: 'Kg' },
    { id: '4', nome: 'Insumo D', qtd: 0,  unidade: 'Un' },
    { id: '5', nome: 'Insumo E', qtd: 18, unidade: 'Litros' },
  ];
  
  export const MOCK_MOVIMENTACOES = [
    { id: '1', tipo: 'Saída',   insumo: 'Insumo B', qtd: 3,  data: '28/03/2026', responsavel: 'Ana' },
    { id: '2', tipo: 'Entrada', insumo: 'Insumo C', qtd: 10, data: '25/03/2026', responsavel: 'Gabriel' },
    { id: '3', tipo: 'Saída',   insumo: 'Insumo A', qtd: 20, data: '15/03/2026', responsavel: 'Ana' },
    { id: '4', tipo: 'Entrada', insumo: 'Insumo E', qtd: 18, data: '10/03/2026', responsavel: 'Gabriel' },
    { id: '5', tipo: 'Entrada', insumo: 'Insumo A', qtd: 54,  data: '05/03/2026', responsavel: 'Gabriel' },
    { id: '6', tipo: 'Entrada', insumo: 'Insumo B', qtd: 5, data: '02/03/2026', responsavel: 'Ana' },
  ];
  
  export const MOCK_USUARIOS = [
    { id: '1', usuario: 'Gabriel', permissao: 'Padrão' },
    { id: '2', usuario: 'Ana',     permissao: 'Admin' },
  ];

  export const MOCK_INSUMOS_CADASTRADOS = [
    { id: '1', nome: 'Insumo A', unidade: 'Litros', estoqueMinimo: 10 },
    { id: '2', nome: 'Insumo B', unidade: 'Un',     estoqueMinimo: 5  },
    { id: '3', nome: 'Insumo C', unidade: 'Kg',     estoqueMinimo: 8  },
  ];
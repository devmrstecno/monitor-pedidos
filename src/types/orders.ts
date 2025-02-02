export type OrderStatus = 'Chegou' | 'Fazendo' | 'Concluído';

export type Order = {
  id: number;
  setor: string;
  itens: string;
  status: OrderStatus;
};

export const INITIAL_ORDERS: Order[] = [
  // Pratos
  { id: 1, setor: 'Pratos', itens: 'Feijoada, Arroz', status: 'Chegou' },
  { id: 2, setor: 'Pratos', itens: 'Strogonoff, Batata Palha', status: 'Fazendo' },
  { id: 3, setor: 'Pratos', itens: 'Filé à Parmegiana, Arroz', status: 'Chegou' },
  { id: 4, setor: 'Pratos', itens: 'Lasanha à Bolonhesa', status: 'Fazendo' },
  { id: 5, setor: 'Pratos', itens: 'Picanha, Arroz, Farofa', status: 'Concluído' },
  
  // Bebidas
  { id: 6, setor: 'Bebidas', itens: 'Suco de Laranja', status: 'Fazendo' },
  { id: 7, setor: 'Bebidas', itens: 'Coca-Cola 350ml', status: 'Chegou' },
  { id: 8, setor: 'Bebidas', itens: 'Água Mineral com Gás', status: 'Concluído' },
  { id: 9, setor: 'Bebidas', itens: 'Suco de Abacaxi com Hortelã', status: 'Chegou' },
  { id: 10, setor: 'Bebidas', itens: 'Cerveja Heineken', status: 'Fazendo' },
  
  // Saladas
  { id: 11, setor: 'Saladas', itens: 'Salada Caesar', status: 'Concluído' },
  { id: 12, setor: 'Saladas', itens: 'Salada Caprese', status: 'Chegou' },
  { id: 13, setor: 'Saladas', itens: 'Salada Grega', status: 'Fazendo' },
  { id: 14, setor: 'Saladas', itens: 'Salada de Quinoa', status: 'Chegou' },
  { id: 15, setor: 'Saladas', itens: 'Salada Waldorf', status: 'Fazendo' },
  
  // Sobremesas
  { id: 16, setor: 'Sobremesas', itens: 'Pudim', status: 'Chegou' },
  { id: 17, setor: 'Sobremesas', itens: 'Mousse de Chocolate', status: 'Fazendo' },
  { id: 18, setor: 'Sobremesas', itens: 'Pavê de Chocolate', status: 'Concluído' },
  { id: 19, setor: 'Sobremesas', itens: 'Torta de Limão', status: 'Chegou' },
  { id: 20, setor: 'Sobremesas', itens: 'Sorvete de Creme', status: 'Fazendo' },
];

export const SECTORS = ['Pratos', 'Bebidas', 'Saladas', 'Sobremesas'] as const;
export const STATUSES: OrderStatus[] = ['Chegou', 'Fazendo', 'Concluído'];

export const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case 'Chegou':
      return 'bg-status-new';
    case 'Fazendo':
      return 'bg-status-processing';
    case 'Concluído':
      return 'bg-status-completed';
  }
};

export const getStatusHoverColor = (status: OrderStatus): string => {
  switch (status) {
    case 'Chegou':
      return 'hover:bg-status-new-hover';
    case 'Fazendo':
      return 'hover:bg-status-processing-hover';
    case 'Concluído':
      return 'hover:bg-status-completed-hover';
  }
};
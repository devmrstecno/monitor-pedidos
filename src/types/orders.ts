export type OrderStatus = 'Chegou' | 'Fazendo' | 'Concluído';

export type Order = {
  id: number;
  setor: string;
  itens: string;
  status: OrderStatus;
};

export const INITIAL_ORDERS: Order[] = [
  { id: 1, setor: 'Pratos', itens: 'Feijoada, Arroz', status: 'Chegou' },
  { id: 2, setor: 'Bebidas', itens: 'Suco de Laranja', status: 'Fazendo' },
  { id: 3, setor: 'Saladas', itens: 'Salada Caesar', status: 'Concluído' },
  { id: 4, setor: 'Sobremesas', itens: 'Pudim', status: 'Chegou' },
  { id: 5, setor: 'Pratos', itens: 'Strogonoff', status: 'Fazendo' },
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
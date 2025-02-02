export type OrderStatus = 'Chegou' | 'Fazendo' | 'Concluído';
export type OrderOrigin = 'Delivery AnoteJá' | 'Card Ifood' | 'Comanda Mesa' | 'Auto Atendimento';

export type Order = {
  id: number;
  setor: string;
  itens: string;
  status: OrderStatus;
  origin: OrderOrigin;
};

export const INITIAL_ORDERS: Order[] = [
  // Pratos
  { id: 1, setor: 'Pratos', itens: 'Feijoada, Arroz', status: 'Chegou', origin: 'Delivery AnoteJá' },
  { id: 2, setor: 'Pratos', itens: 'Strogonoff, Batata Palha', status: 'Fazendo', origin: 'Card Ifood' },
  { id: 3, setor: 'Pratos', itens: 'Filé à Parmegiana, Arroz', status: 'Chegou', origin: 'Comanda Mesa' },
  { id: 4, setor: 'Pratos', itens: 'Lasanha à Bolonhesa', status: 'Fazendo', origin: 'Auto Atendimento' },
  { id: 5, setor: 'Pratos', itens: 'Picanha, Arroz, Farofa', status: 'Concluído', origin: 'Card Ifood' },
  
  // Bebidas
  { id: 6, setor: 'Bebidas', itens: 'Suco de Laranja', status: 'Fazendo', origin: 'Comanda Mesa' },
  { id: 7, setor: 'Bebidas', itens: 'Coca-Cola 350ml', status: 'Chegou', origin: 'Auto Atendimento' },
  { id: 8, setor: 'Bebidas', itens: 'Água Mineral com Gás', status: 'Concluído', origin: 'Delivery AnoteJá' },
  { id: 9, setor: 'Bebidas', itens: 'Suco de Abacaxi com Hortelã', status: 'Chegou', origin: 'Card Ifood' },
  { id: 10, setor: 'Bebidas', itens: 'Cerveja Heineken', status: 'Fazendo', origin: 'Comanda Mesa' },
  
  // Saladas
  { id: 11, setor: 'Saladas', itens: 'Salada Caesar', status: 'Concluído', origin: 'Auto Atendimento' },
  { id: 12, setor: 'Saladas', itens: 'Salada Caprese', status: 'Chegou', origin: 'Delivery AnoteJá' },
  { id: 13, setor: 'Saladas', itens: 'Salada Grega', status: 'Fazendo', origin: 'Card Ifood' },
  { id: 14, setor: 'Saladas', itens: 'Salada de Quinoa', status: 'Chegou', origin: 'Comanda Mesa' },
  { id: 15, setor: 'Saladas', itens: 'Salada Waldorf', status: 'Fazendo', origin: 'Auto Atendimento' },
  
  // Sobremesas
  { id: 16, setor: 'Sobremesas', itens: 'Pudim', status: 'Chegou', origin: 'Card Ifood' },
  { id: 17, setor: 'Sobremesas', itens: 'Mousse de Chocolate', status: 'Fazendo', origin: 'Comanda Mesa' },
  { id: 18, setor: 'Sobremesas', itens: 'Pavê de Chocolate', status: 'Concluído', origin: 'Auto Atendimento' },
  { id: 19, setor: 'Sobremesas', itens: 'Torta de Limão', status: 'Chegou', origin: 'Delivery AnoteJá' },
  { id: 20, setor: 'Sobremesas', itens: 'Sorvete de Creme', status: 'Fazendo', origin: 'Card Ifood' },
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
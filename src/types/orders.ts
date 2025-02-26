
export type OrderStatus = 'Chegou' | 'Fazendo' | 'Concluído';
export type OrderOrigin = 'Delivery AnoteJá' | 'Card Ifood' | 'Comanda Mesa' | 'Auto Atendimento' | 'Cardapio Mesa';

export interface Order {
  id: number;
  setor: string;
  itens: string;
  status: OrderStatus;
  origin: OrderOrigin;
}

export const SECTORS = ['Pratos', 'Bebidas', 'Saladas', 'Sobremesas'] as const;
export const STATUSES: OrderStatus[] = ['Chegou', 'Fazendo', 'Concluído'];

export const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case 'Chegou':
      return 'bg-yellow-100 text-yellow-800';
    case 'Fazendo':
      return 'bg-blue-100 text-blue-800';
    case 'Concluído':
      return 'bg-green-100 text-green-800';
  }
};

export const getStatusHoverColor = (status: OrderStatus): string => {
  switch (status) {
    case 'Chegou':
      return 'hover:bg-yellow-200';
    case 'Fazendo':
      return 'hover:bg-blue-200';
    case 'Concluído':
      return 'hover:bg-green-200';
  }
};

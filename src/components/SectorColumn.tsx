import { Order, OrderStatus, STATUSES } from "@/types/orders";
import { StatusColumn } from "./StatusColumn";

interface SectorColumnProps {
  sector: string;
  orders: Order[];
  onStatusUpdate: (id: number, status: OrderStatus) => void;
}

export const SectorColumn = ({ sector, orders, onStatusUpdate }: SectorColumnProps) => {
  const sectorOrders = orders.filter((order) => order.setor === sector);

  return (
    <div className="flex-1 min-w-[300px]">
      <h2 className="text-xl font-bold mb-4 pb-2 border-b">{sector}</h2>
      <div className="space-y-8">
        {STATUSES.map((status) => (
          <StatusColumn
            key={status}
            status={status}
            orders={sectorOrders.filter((order) => order.status === status)}
            onStatusUpdate={onStatusUpdate}
          />
        ))}
      </div>
    </div>
  );
};
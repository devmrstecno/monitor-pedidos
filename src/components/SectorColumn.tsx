import { Order, OrderStatus, STATUSES } from "@/types/orders";
import { StatusColumn } from "./StatusColumn";

interface SectorColumnProps {
  sector: string;
  orders: Order[];
  onStatusUpdate: (id: number, status: OrderStatus) => void;
}

export const SectorColumn = ({ sector, orders, onStatusUpdate }: SectorColumnProps) => {
  return (
    <div className="w-full">
      <div className="space-y-8">
        {STATUSES.map((status) => (
          <StatusColumn
            key={status}
            status={status}
            orders={orders.filter((order) => order.status === status)}
            onStatusUpdate={onStatusUpdate}
          />
        ))}
      </div>
    </div>
  );
};
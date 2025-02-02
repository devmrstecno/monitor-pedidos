import { Order, OrderStatus, getStatusColor } from "@/types/orders";
import { OrderCard } from "./OrderCard";

interface StatusColumnProps {
  status: OrderStatus;
  orders: Order[];
  onStatusUpdate: (id: number, status: OrderStatus) => void;
}

export const StatusColumn = ({ status, orders, onStatusUpdate }: StatusColumnProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className={`${getStatusColor(status)} p-2 rounded-md`}>
        <h3 className="font-semibold text-center">{status}</h3>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} onStatusUpdate={onStatusUpdate} />
        ))}
      </div>
    </div>
  );
};
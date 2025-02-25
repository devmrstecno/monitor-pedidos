
import { Order, OrderStatus, getStatusColor } from "@/types/orders";
import { OrderCard } from "./OrderCard";
import { Droppable } from "@hello-pangea/dnd";

interface StatusColumnProps {
  status: OrderStatus;
  orders: Order[];
  onStatusUpdate: (id: number, status: OrderStatus) => void;
}

export const StatusColumn = ({ status, orders, onStatusUpdate }: StatusColumnProps) => {
  return (
    <div className="flex-1 min-w-[300px] bg-white rounded-lg shadow p-4">
      <div className={`${getStatusColor(status)} p-2 rounded-md mb-4`}>
        <h3 className="font-semibold text-center">{status}</h3>
      </div>
      <Droppable droppableId={status}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-4 min-h-[200px]"
          >
            {orders.map((order, index) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onStatusUpdate={onStatusUpdate}
                index={index}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

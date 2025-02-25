
import { Order, OrderStatus, STATUSES } from "@/types/orders";
import { StatusColumn } from "./StatusColumn";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";

interface SectorColumnProps {
  sector: string;
  orders: Order[];
  onStatusUpdate: (id: number, status: OrderStatus) => void;
}

export const SectorColumn = ({ sector, orders, onStatusUpdate }: SectorColumnProps) => {
  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;

    if (!destination) return;

    const newStatus = destination.droppableId as OrderStatus;
    onStatusUpdate(Number(draggableId), newStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    </DragDropContext>
  );
};

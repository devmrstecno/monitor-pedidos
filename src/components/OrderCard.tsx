import { Order, OrderStatus, getStatusColor, getStatusHoverColor } from "@/types/orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Draggable } from "@hello-pangea/dnd";

interface OrderCardProps {
  order: Order;
  onStatusUpdate: (id: number, status: OrderStatus) => void;
  index: number;
}

export const OrderCard = ({ order, onStatusUpdate, index }: OrderCardProps) => {
  const handleStatusUpdate = (newStatus: OrderStatus) => {
    onStatusUpdate(order.id, newStatus);
    toast({
      title: `Pedido #${order.id} atualizado`,
      description: `Status alterado para: ${newStatus}`,
    });
  };

  return (
    <Draggable draggableId={order.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card className="w-full animate-fadeIn cursor-move">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold">Pedido #{order.id}</CardTitle>
                <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {order.origin}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <h4 className="font-medium mb-1">Itens:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {order.itens.split(',').map((item, index) => (
                      <li key={index} className="text-sm">{item.trim()}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {['Chegou', 'Fazendo', 'Concluído'].map((status) => (
                    <Button
                      key={status}
                      onClick={() => handleStatusUpdate(status as OrderStatus)}
                      className={`${
                        order.status === status
                          ? getStatusColor(status as OrderStatus)
                          : 'bg-gray-100 hover:bg-gray-200'
                      } ${getStatusHoverColor(status as OrderStatus)} text-gray-800 transition-colors`}
                      variant="ghost"
                      size="sm"
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};
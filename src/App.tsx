import { useState } from "react";
import { SectorColumn } from "./components/SectorColumn";
import { INITIAL_ORDERS, SECTORS, OrderStatus } from "./types/orders";
import { Toaster } from "@/components/ui/toaster";

const App = () => {
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  const handleStatusUpdate = (id: number, newStatus: OrderStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Monitor de Pedidos</h1>
          <div className="flex flex-wrap gap-8">
            {SECTORS.map((sector) => (
              <SectorColumn
                key={sector}
                sector={sector}
                orders={orders}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default App;
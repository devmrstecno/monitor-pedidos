
import { useState } from "react";
import { INITIAL_ORDERS, SECTORS, OrderStatus } from "./types/orders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectorColumn } from "./components/SectorColumn";

function App() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  const handleStatusUpdate = (id: number, newStatus: OrderStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Monitor de Pedidos MRS Tecno</h1>
        
        <Tabs defaultValue="Pratos" className="w-full">
          <TabsList className="mb-8">
            {SECTORS.map((sector) => (
              <TabsTrigger key={sector} value={sector} className="text-lg">
                {sector}
              </TabsTrigger>
            ))}
          </TabsList>

          {SECTORS.map((sector) => (
            <TabsContent key={sector} value={sector} className="mt-0">
              <SectorColumn
                sector={sector}
                orders={orders.filter(order => order.setor === sector)}
                onStatusUpdate={handleStatusUpdate}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

export default App;

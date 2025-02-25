
import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { INITIAL_ORDERS, SECTORS, OrderStatus } from "./types/orders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectorColumn } from "./components/SectorColumn";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import ConfigPage from "./pages/Config";
import { Toaster } from "./components/ui/toaster";

function App() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  const handleStatusUpdate = (id: number, newStatus: OrderStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const HomePage = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Monitor de Pedidos MRS Tecno</h1>
          <Link to="/config">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configurações
            </Button>
          </Link>
        </div>
        
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

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/config" element={<ConfigPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;


import { useState, useEffect, useRef } from "react";
import { SectorColumn } from "./components/SectorColumn";
import { INITIAL_ORDERS, SECTORS, OrderStatus, Order } from "./types/orders";
import { Toaster } from "@/components/ui/toaster";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVoiceControl } from "./hooks/useVoiceControl";
import { Button } from "./components/ui/button";
import { Mic, MicOff, VolumeX, Volume2, Settings } from "lucide-react";
import { fetchOrdersFromDb } from "./services/dbService";
import { Routes, Route, Link } from "react-router-dom";
import { toast } from "./components/ui/use-toast";
import ConfigPage from "./pages/Config";

const MainContent = () => {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const previousOrdersRef = useRef<Order[]>([]);

  const handleStatusUpdate = (id: number, newStatus: OrderStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const { isListening, transcript, startListening, announceNewOrder, isSpeakingEnabled, toggleSpeaking } = useVoiceControl({
    orders,
    onStatusUpdate: handleStatusUpdate,
  });

  // Fetch orders from database for "Pratos" sector
  useEffect(() => {
    const loadDbOrders = async () => {
      try {
        const dbOrders = await fetchOrdersFromDb();
        setOrders(prev => {
          // Replace only "Pratos" orders with database orders
          const otherOrders = prev.filter(order => order.setor !== 'Pratos');
          return [...otherOrders, ...dbOrders];
        });
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        toast({
          title: "Erro ao carregar pedidos",
          description: "Verifique a configuração do banco de dados.",
          variant: "destructive",
        });
      }
    };

    if (localStorage.getItem('dbConfig')) {
      loadDbOrders();
    }
  }, []);

  // Check for new orders and announce them
  useEffect(() => {
    const newOrders = orders.filter(
      order => 
        order.status === 'Chegou' && 
        !previousOrdersRef.current.some(prevOrder => prevOrder.id === order.id)
    );
    
    newOrders.forEach(order => {
      announceNewOrder(order);
    });

    previousOrdersRef.current = orders;
  }, [orders, announceNewOrder]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Monitor de Pedidos MRS Tecno</h1>
          <div className="flex gap-4">
            <Link to="/config">
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configurações
              </Button>
            </Link>
            <Button
              onClick={toggleSpeaking}
              variant={isSpeakingEnabled ? "default" : "destructive"}
              className="flex items-center gap-2"
            >
              {isSpeakingEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              {isSpeakingEnabled ? "Anúncios Ativos" : "Anúncios Desativados"}
            </Button>
            <Button
              onClick={startListening}
              variant={isListening ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isListening ? "Parar" : "Iniciar"} Comando de Voz
            </Button>
          </div>
        </div>
        
        {transcript && (
          <div className="mb-4 p-2 bg-gray-100 rounded">
            Último comando: {transcript}
          </div>
        )}
        
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
};

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/config" element={<ConfigPage />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;

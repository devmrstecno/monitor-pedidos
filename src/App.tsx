
import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { OrderStatus, SECTORS, Order } from "./types/orders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectorColumn } from "./components/SectorColumn";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import ConfigPage from "./pages/Config";
import { Toaster } from "./components/ui/toaster";
import { toast } from "@/components/ui/use-toast";

interface CommandItem {
  cm_numero: string;
  desc_produto: string;
  localicao_produto: string;
  quantidade: number;
  obs: string;
}

function App() {
  const [comandaItems, setComandaItems] = useState<CommandItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const testConnection = async () => {
    const config = localStorage.getItem('dbConfig');
    if (!config) {
      toast({
        title: "Erro de conexão",
        description: "Configure o banco de dados primeiro.",
        variant: "destructive"
      });
      return false;
    }

    const { host, user, password } = JSON.parse(config);
    try {
      const response = await fetch('http://localhost:3000/api/database/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ host, user, password }),
      });

      const data = await response.json();
      if (data.success) {
        setIsConnected(true);
        return true;
      } else {
        toast({
          title: "Erro de conexão",
          description: "Não foi possível conectar ao banco de dados.",
          variant: "destructive"
        });
        setIsConnected(false);
        return false;
      }
    } catch (error) {
      toast({
        title: "Erro de conexão",
        description: "Erro ao tentar conectar ao banco de dados.",
        variant: "destructive"
      });
      setIsConnected(false);
      return false;
    }
  };

  const fetchComandaItems = async () => {
    const config = localStorage.getItem('dbConfig');
    if (!config) return;

    const { host, user, password, database, table } = JSON.parse(config);
    
    try {
      const response = await fetch('http://localhost:3000/api/database/get-table-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host,
          user,
          password,
          database,
          table
        }),
      });

      const data = await response.json();
      console.log('Dados recebidos do banco:', data); // Log para debug

      if (data.success && data.data) {
        // Garantir que data.data é um array
        const items = Array.isArray(data.data) ? data.data : [data.data];
        
        const filteredItems = items.filter((item: CommandItem) => 
          item.localicao_produto === 'COZINHA'
        );
        console.log('Itens filtrados:', filteredItems); // Log para debug
        setComandaItems(filteredItems);

        // Processa os itens filtrados para criar os pedidos
        const groupedItems = filteredItems.reduce((acc: Record<string, CommandItem[]>, item) => {
          if (!acc[item.cm_numero]) {
            acc[item.cm_numero] = [];
          }
          acc[item.cm_numero].push(item);
          return acc;
        }, {});

        console.log('Itens agrupados:', groupedItems); // Log para debug

        const newOrders: Order[] = Object.entries(groupedItems).map(([cm_numero, items]) => ({
          id: parseInt(cm_numero),
          setor: 'Pratos',
          itens: items.map(item => `${item.quantidade}x ${item.desc_produto}${item.obs ? ` (${item.obs})` : ''}`).join(', '),
          status: 'Chegou',
          origin: 'Comanda Mesa'
        }));

        console.log('Novos pedidos:', newOrders); // Log para debug
        setOrders(newOrders);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao buscar dados da tabela.",
        variant: "destructive"
      });
    }
  };

  // Efeito para testar a conexão inicial e configurar o intervalo de atualização
  useEffect(() => {
    const init = async () => {
      const connected = await testConnection();
      if (connected) {
        await fetchComandaItems();
      }
    };

    init();

    // Configura o intervalo de atualização (3 segundos)
    const interval = setInterval(async () => {
      if (isConnected) {
        await fetchComandaItems();
      }
    }, 3000);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(interval);
  }, [isConnected]);

  const handleStatusUpdate = (id: number, newStatus: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const HomePage = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-800">Monitor de Pedidos MRS Tecno</h1>
            <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} 
                 title={isConnected ? 'Conectado' : 'Desconectado'} />
          </div>
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

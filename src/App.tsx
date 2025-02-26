
import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { OrderStatus, SECTORS } from "./types/orders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectorColumn } from "./components/SectorColumn";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import ConfigPage from "./pages/Config";
import { Toaster } from "./components/ui/toaster";

interface CommandItem {
  cm_numero: string;
  desc_produto: string;
  localicao_produto: string;
  quantidade: number;
  obs: string;
}

function App() {
  const [comandaItems, setComandaItems] = useState<CommandItem[]>([]);

  useEffect(() => {
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
        if (data.success) {
          const filteredItems = data.data.filter((item: CommandItem) => 
            item.localicao_produto === 'COZINHA'
          );
          setComandaItems(filteredItems);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchComandaItems();
  }, []);

  // Agrupa os itens por cm_numero
  const groupedItems = comandaItems.reduce((acc: Record<string, CommandItem[]>, item) => {
    if (!acc[item.cm_numero]) {
      acc[item.cm_numero] = [];
    }
    acc[item.cm_numero].push(item);
    return acc;
  }, {});

  // Converte os itens agrupados para o formato de Orders
  const orders = Object.entries(groupedItems).map(([cm_numero, items]) => ({
    id: parseInt(cm_numero),
    setor: 'Pratos',
    itens: items.map(item => `${item.quantidade}x ${item.desc_produto}${item.obs ? ` (${item.obs})` : ''}`).join(', '),
    status: 'Chegou' as OrderStatus,
    origin: 'Comanda Mesa'
  }));

  const handleStatusUpdate = (id: number, newStatus: OrderStatus) => {
    // Implementar atualização de status quando necessário
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

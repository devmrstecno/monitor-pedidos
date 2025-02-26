
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface DbConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  table: string;
}

interface DbConnection {
  isConnected: boolean;
  databases: string[];
  tables: string[];
}

const ConfigPage = () => {
  const [config, setConfig] = useState<DbConfig>(() => {
    const saved = localStorage.getItem('dbConfig');
    return saved ? JSON.parse(saved) : {
      host: 'localhost',
      user: '',
      password: '',
      database: '',
      table: ''
    };
  });

  const [connection, setConnection] = useState<DbConnection>({
    isConnected: false,
    databases: [],
    tables: []
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/database/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host: config.host,
          user: config.user,
          password: config.password
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Falha na conexão');
      }

      setConnection({
        isConnected: true,
        databases: data.databases,
        tables: []
      });

      toast({
        title: "Conexão estabelecida",
        description: "Conexão com o MySQL realizada com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro:', error);
      toast({
        title: "Erro na conexão",
        description: error.message || "Não foi possível conectar ao banco de dados.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDatabaseSelect = async (dbName: string) => {
    setConfig(prev => ({ ...prev, database: dbName }));
    try {
      const response = await fetch('http://localhost:3000/api/database/get-tables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host: config.host,
          user: config.user,
          password: config.password,
          database: dbName
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Falha ao carregar tabelas');
      }

      setConnection(prev => ({
        ...prev,
        tables: data.tables
      }));
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível carregar as tabelas.",
        variant: "destructive"
      });
    }
  };

  const handleSave = () => {
    localStorage.setItem('dbConfig', JSON.stringify(config));
    toast({
      title: "Configuração salva",
      description: "As configurações do banco de dados foram salvas com sucesso.",
    });
  };

  const handleChange = (field: keyof DbConfig, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            ← Voltar ao Monitor
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Configuração do Banco de Dados</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Configuração MySQL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="host">Host</Label>
              <Input
                id="host"
                value={config.host}
                onChange={(e) => handleChange('host', e.target.value)}
                placeholder="localhost"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="user">Usuário</Label>
              <Input
                id="user"
                value={config.user}
                onChange={(e) => handleChange('user', e.target.value)}
                placeholder="root"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={config.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Digite a senha"
              />
            </div>

            <Button 
              onClick={handleConnect} 
              className="w-full"
              disabled={isLoading || !config.host || !config.user}
            >
              {isLoading ? "Conectando..." : "Conectar ao Banco"}
            </Button>

            {connection.isConnected && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="database">Selecione o Banco de Dados</Label>
                  <Select
                    value={config.database}
                    onValueChange={(value) => handleDatabaseSelect(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um banco" />
                    </SelectTrigger>
                    <SelectContent>
                      {connection.databases.map((db) => (
                        <SelectItem key={db} value={db}>
                          {db}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {config.database && connection.tables.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="table">Selecione a Tabela</Label>
                    <Select
                      value={config.table}
                      onValueChange={(value) => handleChange('table', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma tabela" />
                      </SelectTrigger>
                      <SelectContent>
                        {connection.tables.map((table) => (
                          <SelectItem key={table} value={table}>
                            {table}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {config.database && config.table && (
                  <Button onClick={handleSave} className="w-full">
                    Salvar Configurações
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConfigPage;

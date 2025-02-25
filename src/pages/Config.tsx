
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DbConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  table: string;
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
        <Card>
          <CardHeader>
            <CardTitle>Configuração do Banco de Dados</CardTitle>
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
            
            <div className="space-y-2">
              <Label htmlFor="database">Banco de Dados</Label>
              <Input
                id="database"
                value={config.database}
                onChange={(e) => handleChange('database', e.target.value)}
                placeholder="Nome do banco de dados"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="table">Tabela</Label>
              <Input
                id="table"
                value={config.table}
                onChange={(e) => handleChange('table', e.target.value)}
                placeholder="Nome da tabela"
              />
            </div>

            <Button onClick={handleSave} className="w-full">
              Salvar Configurações
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConfigPage;

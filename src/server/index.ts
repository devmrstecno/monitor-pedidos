
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();

// Configuração mais específica do CORS
app.use(cors({
  origin: ['http://localhost:8081', 'http://127.0.0.1:8081'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Rota para testar conexão e listar bancos de dados
app.post('/api/mysql/connect', async (req, res) => {
  const { host, user, password } = req.body;
  console.log('Tentando conectar com:', { host, user });

  if (!host || !user) {
    return res.status(400).json({ error: 'Host e usuário são obrigatórios' });
  }

  try {
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      port: 3306 // Porta padrão do MySQL
    });

    console.log('Conexão estabelecida com sucesso');

    const [results] = await connection.query('SHOW DATABASES');
    const databases = (results as any[]).map(row => row.Database);
    
    await connection.end();

    res.json({ databases });
  } catch (error: any) {
    console.error('Erro detalhado na conexão:', error);
    let errorMessage = 'Falha na conexão com o banco de dados';
    
    if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Não foi possível conectar ao MySQL. Verifique se o serviço está rodando.';
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      errorMessage = 'Acesso negado. Verifique usuário e senha.';
    }

    res.status(500).json({ error: errorMessage });
  }
});

// Rota para listar tabelas de um banco específico
app.post('/api/mysql/tables', async (req, res) => {
  const { host, user, password } = req.body;
  const database = req.query.database as string;
  console.log('Listando tabelas para o banco:', database);

  if (!database) {
    return res.status(400).json({ error: 'Nome do banco de dados é obrigatório' });
  }

  try {
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      database,
      port: 3306
    });

    const [results] = await connection.query('SHOW TABLES');
    const tables = (results as any[]).map(row => Object.values(row)[0] as string);
    
    await connection.end();

    res.json({ tables });
  } catch (error) {
    console.error('Erro ao listar tabelas:', error);
    res.status(500).json({ error: 'Falha ao listar tabelas' });
  }
});

// Rota de teste para verificar se o servidor está rodando
app.get('/', (req, res) => {
  res.json({ message: 'Servidor está rodando!' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log('Aceitando conexões de: http://localhost:8081');
});

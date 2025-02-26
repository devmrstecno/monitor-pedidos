
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';

const app = express();

app.use(cors({
  origin: ['http://localhost:8081', 'http://127.0.0.1:8081'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Função para criar conexão MySQL
const createConnection = (connectionData: any) => {
  return mysql.createConnection({
    host: connectionData.host,
    user: connectionData.user,
    password: connectionData.password,
    database: connectionData.database,
    port: 3306
  });
};

// Rota para testar conexão e listar bancos
app.post('/api/database/test-connection', (req, res) => {
  const connection = createConnection(req.body);
  
  connection.connect((err) => {
    if (err) {
      console.error('Erro na conexão:', err);
      res.status(500).json({ 
        success: false, 
        message: err.message 
      });
      return;
    }

    // Listar databases
    connection.query('SHOW DATABASES', (err, results: any) => {
      if (err) {
        res.status(500).json({ 
          success: false, 
          message: err.message 
        });
        return;
      }

      const databases = results.map((row: any) => row.Database);
      res.json({ 
        success: true, 
        databases: databases 
      });
      connection.end();
    });
  });
});

// Rota para listar tabelas
app.post('/api/database/get-tables', (req, res) => {
  const connection = createConnection(req.body);
  
  connection.connect((err) => {
    if (err) {
      res.status(500).json({ 
        success: false, 
        message: err.message 
      });
      return;
    }

    connection.query('SHOW TABLES', (err, results: any) => {
      if (err) {
        res.status(500).json({ 
          success: false, 
          message: err.message 
        });
        return;
      }

      const tables = results.map((row: any) => Object.values(row)[0]);
      res.json({ 
        success: true, 
        tables: tables 
      });
      connection.end();
    });
  });
});

// Rota para buscar dados da tabela
app.post('/api/database/get-table-data', (req, res) => {
  const { database, table } = req.body;
  const connection = createConnection(req.body);
  
  connection.connect((err) => {
    if (err) {
      console.error('Erro na conexão:', err);
      res.status(500).json({ 
        success: false, 
        message: err.message 
      });
      return;
    }

    // Usando o banco especificado
    connection.query(`USE ${database}`);
    
    // Buscando dados da tabela
    connection.query(`SELECT * FROM ${table} LIMIT 100`, (err, results) => {
      if (err) {
        console.error('Erro ao buscar dados:', err);
        res.status(500).json({ 
          success: false, 
          message: err.message 
        });
        return;
      }

      res.json({ 
        success: true, 
        data: results 
      });
      connection.end();
    });
  });
});

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'Servidor está rodando!' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log('Aceitando conexões de: http://localhost:8081');
});

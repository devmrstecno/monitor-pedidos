
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/mysql/connect', async (req, res) => {
  const { host, user, password } = req.body;

  try {
    const connection = await mysql.createConnection({
      host,
      user,
      password
    });

    const [results] = await connection.query('SHOW DATABASES');
    const databases = (results as any[]).map(row => row.Database);
    
    await connection.end();

    res.json({ databases });
  } catch (error) {
    console.error('Erro na conexão:', error);
    res.status(500).json({ error: 'Falha na conexão com o banco de dados' });
  }
});

app.post('/api/mysql/tables', async (req, res) => {
  const { host, user, password } = req.body;
  const database = req.query.database as string;

  try {
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      database
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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

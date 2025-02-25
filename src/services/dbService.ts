
import mysql from 'mysql2/promise';
import { Order } from '@/types/orders';

interface DbConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  table: string;
}

export const fetchOrdersFromDb = async (): Promise<Order[]> => {
  const configStr = localStorage.getItem('dbConfig');
  if (!configStr) {
    throw new Error('Database configuration not found');
  }

  const config: DbConfig = JSON.parse(configStr);
  
  try {
    const connection = await mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database
    });

    const [rows] = await connection.execute(`SELECT * FROM ${config.table}`);
    await connection.end();

    // Convert database rows to Order type
    return (rows as any[]).map(row => ({
      id: row.id,
      setor: row.setor || 'Pratos',
      itens: row.itens || '',
      status: row.status || 'Chegou',
      origin: row.origin || 'Delivery AnoteJá'
    }));
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

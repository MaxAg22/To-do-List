import mysql from "promise-mysql";
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_USER,
  DB_PORT
 } from './config.js';

let connection;

export const getConnection = async () => {
  if (!connection) {
    connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD
    });
  }

  console.log("Database config:",
  DB_HOST, DB_PORT, DB_USER, DB_NAME
  );

  return connection;
};

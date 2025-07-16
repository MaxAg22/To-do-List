import mysql from "promise-mysql";
import dotenv from "dotenv";
dotenv.config();

let connection;

export const getConnection = async () => {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.HOST,
      database: process.env.USERS_DATABASE,
      user: process.env.USER,
      password: process.env.PASSWORD
    });
  }
  return connection;
};

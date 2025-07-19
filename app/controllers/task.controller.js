import { getConnection } from '../database.js';
import jsonwebtoken from "jsonwebtoken";


async function addTask(req,res) {
  // Check input
  console.log("Task input: ", req.body);
  const taskDescription = req.body.taskDescription;
  const comment = req.body.comment;
  const dueDate = req.body.dueDate;
  const done = req.body.done;

  if(!taskDescription) return res.status(400).send({status:"Error",message:"Missing task description"});

  console.log('Cookies:', req.cookies);


  // Get user-id
  const token = req.cookies.jwt;
  if (!token) return res.status(401).send("Unauthorized");

  let payload;
  try {
    payload = jsonwebtoken.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(403).send("Invalid token");
  }

  console.log("esta es la cookie clean:", payload);

  const userId = payload.id; 
  console.log("este es el user id: ", userId);

  // Insert to database
  const connection = await getConnection();

  await connection.query(
    "INSERT INTO task (description, comment, duedate, done, user_id) VALUES (?, ?, ?, ?, ?)",
    [taskDescription, comment, dueDate, done, userId]
  );

  console.log("tarea agregada con éxito: ", {taskDescription, comment, dueDate, done, userId});
  return res.status(201).send({status:"ok",message:`Tarea ${taskDescription} agregada`});
}

export const methods = {
  addTask
}
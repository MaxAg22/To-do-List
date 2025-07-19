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

  // Get user-id
  const token = req.cookies.jwt;
  if (!token) return res.status(401).send("Unauthorized");

  let payload;
  try {
    payload = jsonwebtoken.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(403).send("Invalid token");
  }

  const userId = payload.id; 

  // Insert to database
  const connection = await getConnection();

  await connection.query(
    "INSERT INTO task (description, comment, duedate, done, user_id) VALUES (?, ?, ?, ?, ?)",
    [taskDescription, comment, dueDate, done, userId]
  );

  console.log("tarea agregada con éxito: ", {taskDescription, comment, dueDate, done, userId});
  return res.status(201).send({status:"ok",message:`Tarea ${taskDescription} agregada`});
}

async function loadTask(req,res) {
  try{
    // Get user-id
    const token = req.cookies.jwt;
    if (!token) return res.status(401).send("Unauthorized");

    let payload;
    try {
      payload = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(403).send("Invalid token");
    }

    const userId = payload.id; 

    // database query
    const connection = await getConnection();
    const taskDB = await connection.query("SELECT * from task WHERE user_id = ?", userId);
    if(taskDB.length === 0) return res.status(400).send({status: "Error",message: `No se encuentran tareas del usuario con el id: ${userId}`});

      res.json(taskDB);
  } catch(error) {
    console.error("Error al cargar tareas:", error);
    res.status(500).json({ status: "Error", message: "Error interno del servidor" });
  }
}

export const methods = {
  addTask,
  loadTask
}
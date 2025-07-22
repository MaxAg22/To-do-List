import { getConnection } from '../database.js';
import jsonwebtoken from "jsonwebtoken";

async function addTask(req,res) {
  // Check input
  console.log("Add input: ", req.body);
  const taskDescription = req.body.taskDescription;
  const comment = req.body.comment;
  const dueDate = req.body.dueDate;
  const done = req.body.done;

  if(!taskDescription) return res.status(400).send({status:"Error",message:"Missing task description"});

  const userId = req.user.id;     // Get user-id

  // Insert to database
  const connection = await getConnection();

  const result = await connection.query(
    "INSERT INTO task (description, comment, duedate, done, user_id) VALUES (?, ?, ?, ?, ?)",
    [taskDescription, comment, dueDate, done, userId]
  );

  const taskId = result.insertId;

  console.log("Task added successfully: ", {taskDescription, comment, dueDate, done, userId, taskId});

  return res.status(200).send({status:"ok",message:`Task ${taskDescription} added`, id: taskId});
}

async function loadTask(req,res) {
  try{
    const userId = req.user.id;     // Get user-id

    // database query
    const connection = await getConnection();
    const taskDB = await connection.query("SELECT * from task WHERE user_id = ?", userId);
    if(taskDB.length === 0) return res.status(200).send({status: "ok",message: ` No tasks found for user with id: ${userId}`});
    res.json(taskDB);
    return res.status(200).send({status: "ok",message: "Tasks loaded",task: taskDB});
  } catch(error) {
    console.error("Error loading tasks:", error);
    res.status(500).json({ status: "Error", message: "Internal server error"});
  }
}

async function updateTask(req,res) {
  // Check input
  console.log("Update input: ", req.body);
  const done = req.body.done;
  const taskId = req.body.id;

  const userId = req.user.id;    // Get user-id

  if (!taskId || !userId) return res.status(400).send({status: "error",message: `Invalid or missing task id or user id`});

  // Modify database
  const connection = await getConnection();

  const result = await connection.query(
    "UPDATE task SET done = ? WHERE id = ? AND user_id = ?",
    [done, taskId, userId]
  );

  if (result.affectedRows === 0) {
    return res.status(404).send({ status: "error", message: "Task not found or does not belong to you" });
  }

  return res.status(200).send({ status: "ok", message: "Task updated successfully"});
}

async function deleteTask(req,res) {
  // Check input
  console.log("Delete input ", req.body);
  const taskId = req.body.taskId;

  const userId = req.user.id;     // Get user-id

  if (!taskId || !userId) return res.status(400).send({status: "error",message: `Invalid or missing task id or user id`})

  // Delete from database
  const connection = await getConnection();

  const result = await connection.query(
    "DELETE FROM task WHERE id = ? AND user_id = ?",
    [taskId, userId]
  );

  if (result.affectedRows === 0) {
    return res.status(404).send({ status: "error", message: "Task not found"});
  }

  return res.status(200).send({ status: "ok", message: "Task deleted successfully"});
}

export const methods = {
  addTask,
  loadTask,
  updateTask,
  deleteTask
}
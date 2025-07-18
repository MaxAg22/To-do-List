import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { getConnection } from '../database.js';


dotenv.config();

export const usuarios = [{
  user: "a",
  email: "a@a.com",
  password: "$2a$05$nLY2It8riku2vwwDIINdgO/XIyPXRg1Gn9LFgnhwKqC4TwcAwEUL2"
}]

async function login(req,res){

  // Check input
  console.log("Login input: ", req.body);
  const user = req.body.user;
  const password = req.body.password;
  if(!user || !password){
    return res.status(400).send({status:"Error",message:"Los campos están incompletos"})
  }

  // Check database
  const connection = await getConnection();
  const userDB = await connection.query("SELECT * from user WHERE user = ?", user);
  if(userDB.length === 0) return res.status(400).send({status:"Error",message:"Error durante login"});

  // Compare password
  const loginCorrecto = await bcryptjs.compare(password, userDB[0].password);
  if(!loginCorrecto){
    return res.status(400).send({status:"Error",message:"Error durante login"})
  }

  // Create new token
  const token = jsonwebtoken.sign(
    {
      user:userDB[0].user,
      email: userDB[0].email
    },
    process.env.JWT_SECRET,
    {expiresIn:process.env.JWT_EXPIRATION});

  const cookieOption = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
    path: "/"
  }

  res.cookie("jwt",token,cookieOption);
  res.send({status:"ok",message:"Usuario loggeado",redirect:"/admin"});

  console.log("Usuario encontrado con éxito: ", userDB[0]);
}

async function register(req,res){

  // Check input
  console.log("Register input: ", req.body);
  const user = req.body.user;
  const password = req.body.password;
  const email = req.body.email;
  if(!user || !password || !email){
    return res.status(400).send({status:"Error",message:"Los campos están incompletos"})
  }

  // Check database
  const connection = await getConnection();
  const userDB = await connection.query("SELECT * from user WHERE user = ?", user);

  if(userDB.length > 0) {
    console.log("Este usaurio ya existe");
    return res.status(400).send({status:"Error",message:"Este usuario ya existe"});
  }

  // Instert
  const salt = await bcryptjs.genSalt(5);
  const hashPassword = await bcryptjs.hash(password,salt);

  await connection.query(
    "INSERT INTO user (user, email, password) VALUES (?, ?, ?)",
    [user, email, hashPassword]
  );

  console.log("Usuario registrado con éxito: ", {user, email, hashPassword});
  return res.status(201).send({status:"ok",message:`Usuario ${user} agregado`,redirect:"/"})
}

export const methods = {
  login,
  register
}
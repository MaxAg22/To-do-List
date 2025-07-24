import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { getConnection } from '../database.js';
import { sendVerificationMail } from "./../services/mail.service.js";
import {
  JWT_SECRET,
  JWT_EXPIRATION,
  JWT_COOKIE_EXPIRES
} from '../config.js';

async function login(req,res){

  // Check input
  console.log("Login input: ", req.body);
  const user = req.body.user;
  const password = req.body.password;
  if(!user || !password) {
    return res.status(400).send({
      status:"error",
      errorType:"MISSING_FIELDS",
      message:"Missing required fields"
    });
  }

  // Check database
  const connection = await getConnection();
  const [userDB] = await connection.query("SELECT * from user WHERE user = ? AND verified = 1", user);

  if (userDB.length === 0) {
    return res.status(400).send({
      status: "error",
      errorType: "USER_NOT_VERIFIED_OR_NOT_REGISTERED",
      message: "User is not registered or hasn't been verified."
    });
  }

  // Compare password
  const loginCorrecto = await bcryptjs.compare(password, userDB[0].password);
  if(!loginCorrecto) {
    return res.status(400).send({
      status:"error",
      errorType:"INCORRECT_PASSWORD",
      message:"Incorrect password"
    });
  }
    
  // Create new token
  const token = jsonwebtoken.sign(
    {id: userDB[0].id, user:userDB[0].user, email: userDB[0].email},
    JWT_SECRET,
    {expiresIn:JWT_EXPIRATION});

  const cookieOption = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
    path: "/"
  }

  res.cookie("jwt",token,cookieOption);
  res.send({
    status:"ok",
    message:"User logged in successfully",
    redirect:"/user"
  });

  console.log("User logged in successfully: ", userDB[0]);
}

async function register(req,res){

  // Check input
  console.log("Register input: ", req.body);
  const user = req.body.user;
  const password = req.body.password;
  const email = req.body.email;
  if(!user || !password || !email){
    return res.status(400).send({status:"error",message:"Incomplete fields"})
  }

  // Check database
  const connection = await getConnection();
  const [userDB] = await connection.query("SELECT * from user WHERE email = ?", email);

  if(userDB.length > 0) {
    console.log("This user already exists");
    return res.status(400).send({status:"error",message:"This email or username has already been taken"});
  }

  // Verification - Create a token with user and email
  const salt = await bcryptjs.genSalt(5);
  const hashPassword = await bcryptjs.hash(password,salt);

  const token = jsonwebtoken.sign(
    {user:user, email:email},
    JWT_SECRET,
    {expiresIn:JWT_EXPIRATION});

  const mail = await sendVerificationMail(email, token);
  if(mail.accepted===0){
    return res(500).send({status:"error",message:"error sending verification mail"});
  }

  // Insert user in database - This generates a unique id
  await connection.query(
    "INSERT INTO user (user, email, password, verified) VALUES (?, ?, ?, ?)",
    [user, email, hashPassword, false]
  );

  console.log("User successfully registered", {user, email, hashPassword});
  return res.status(201).send({status:"ok",message:`User ${user} added`,redirect:"/"})
}

async function verifyAccount(req,res) {
  try {
    if(!req.params.token){
      return res.redirect("/")
    }

    const deco = jsonwebtoken.verify(req.params.token, JWT_SECRET);
    
    if(!deco || !deco.user){
      return res.redirect("/").send({status:"error", message:"Token error"});
    }

  // Check database
  const connection = await getConnection();
  const [userDB] = await connection.query("SELECT * from user WHERE email = ?", deco.email);
  if(userDB.length === 0) return res.status(400).send({status:"error",message:"Error veryfing user"});

  // Login-in - Create the correct cookie with user id
  const token = jsonwebtoken.sign(
    {id: userDB[0].id, user:userDB[0].user, email: userDB[0].email},
    JWT_SECRET,
    {expiresIn:JWT_EXPIRATION});

  const cookieOption = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
    path: "/"
  }

  const [result] = await connection.query("UPDATE user SET verified = ? WHERE id = ?",
    [1, userDB[0].id]);

  if (result.affectedRows === 0) return res.status(400).send({status: "error",message: "Error verifying user or user already verified"});
  console.log("Usuario verificado correctamente");

  res.cookie("jwt",token,cookieOption);
  res.redirect("/");
  } catch (error) {
    res.status(500);
    res.redirect("/");
  }
}

export const methods = {
  login,
  register,
  verifyAccount
}
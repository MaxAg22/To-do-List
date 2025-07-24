import jsonwebtoken from "jsonwebtoken";
import { getConnection } from '../database.js';
import { JWT_SECRET } from "../config.js";

async function getUserId(req,res,next) {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).send("Unauthorized");
  try {
    const payload = jsonwebtoken.verify(token, JWT_SECRET);
    req.user = payload;  
    next();
  } catch (err) {
    return res.status(403).send("Invalid token");
  }
}

async function onlyUser(req,res,next){
  const logueado = await checkCookie(req);
  if(logueado) return next();
  return res.redirect("/")
}

async function onlyPublic(req,res,next){
  const logueado = await checkCookie(req);
  if(!logueado) return next();
  return res.redirect("/user")
}

async function checkCookie(req){
  try{
    const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
    const decodificada = jsonwebtoken.verify(cookieJWT, JWT_SECRET);
    console.log("Decoded cookie: ", JSON.stringify(decodificada));
    
    const connection = await getConnection();
    const [userDB] = await connection.query("SELECT * from user WHERE user = ?", [decodificada.user]);
    console.log("User found during cookie check: ", userDB[0]);
    if(userDB.length === 0) return false;
    req.user = userDB[0];
    return true;
  }
  catch{
    return false;
  }
}

export const methods = {
  onlyUser,
  onlyPublic,
  getUserId
}


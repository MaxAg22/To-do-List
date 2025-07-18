import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import {usuarios} from "./../controllers/authentication.controller.js";
import { getConnection } from '../database.js';


dotenv.config();

async function soloAdmin(req,res,next){
  const logueado = await revisarCookie(req);
  if(logueado) return next();
  return res.redirect("/")
}

async function soloPublico(req,res,next){
  const logueado = await revisarCookie(req);
  if(!logueado) return next();
  return res.redirect("/admin")
}

async function revisarCookie(req){
  try{
    const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
    const decodificada = jsonwebtoken.verify(cookieJWT,process.env.JWT_SECRET);
    console.log("Cookie decodificada: ", JSON.stringify(decodificada));
    
    //const usuarioAResvisar = usuarios.find(usuario => usuario.user === decodificada.user);
    //console.log(usuarioAResvisar)
    //if(!usuarioAResvisar){
    //  return false
    //}
    //return true;

    const connection = await getConnection();
    const userDB = await connection.query("SELECT * from user WHERE user = ?", decodificada.user);
    console.log("Usuario encontrado en el cookie check: ", userDB[0]);
    if(userDB.length === 0) return false;
    req.user = userDB[0];
    return true;
  }
  catch{
    return false;
  }
}


export const methods = {
  soloAdmin,
  soloPublico,
}


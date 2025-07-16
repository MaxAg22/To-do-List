import  express  from "express";
import cookieParser from 'cookie-parser';
import morgan from "morgan";
import { getConnection } from './database.js';


//Fix para __direname
import path from 'path';
import {fileURLToPath} from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import {methods as authentication} from "./controllers/authentication.controller.js"
import {methods as authorization} from "./middlewares/authorization.js";

//Server
const app = express();
app.set("port",4000);
app.listen(app.get("port"));
console.log("Servidor corriendo en puerto",app.get("port"));

//Configuración
app.use(morgan("dev"));
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(cookieParser())


//Rutas

// Ejemplo de query
app.get("/prueba", async (req,res) =>{
    const connection = await getConnection();
    const result = await connection.query("SELECT * from users");
    res.json(result);
})


app.get("/",authorization.soloPublico, (req,res)=> res.sendFile(__dirname + "/pages/login.html"));
app.get("/register",authorization.soloPublico,(req,res)=> res.sendFile(__dirname + "/pages/register.html"));
app.get("/admin",authorization.soloAdmin,(req,res)=> res.sendFile(__dirname + "/pages/user/list.html"));
app.post("/api/login",authentication.login);
app.post("/api/register",authentication.register);
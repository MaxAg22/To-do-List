import  express  from "express";
import cookieParser from 'cookie-parser';
import morgan from "morgan";
import cors from 'cors';


//Fix para __direname
import path from 'path';
import {fileURLToPath} from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import {methods as authentication} from "./controllers/authentication.controller.js"
import {methods as authorization} from "./middlewares/authorization.js";
import { methods as taskOptions } from "./controllers/task.controller.js";

//Server
const app = express();
app.set("port",4000);
app.listen(app.get("port"));
console.log("Servidor corriendo en puerto",app.get("port"));

//Configuración
app.use(morgan("dev"));
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(cookieParser());

// Read cookies from backend
app.use(cors({
  origin: 'http://localhost:4000', 
  credentials: true
}));


//Rutas
app.get("/",authorization.soloPublico, (req,res)=> res.sendFile(__dirname + "/pages/login.html"));
app.get("/register",authorization.soloPublico,(req,res)=> res.sendFile(__dirname + "/pages/register.html"));
app.get("/user",authorization.soloUser,(req,res)=> res.sendFile(__dirname + "/pages/user/list.html"));
app.post("/api/login",authentication.login);
app.post("/api/register",authentication.register);

//Task
app.post("/api/addTask",taskOptions.addTask);
app.get("/api/loadTask",taskOptions.loadTask);
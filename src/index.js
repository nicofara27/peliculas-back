import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import './database'

const app = express();

app.set("port", process.env.PORT || 4000);

app.listen(app.get("port"), () => {
  console.log("estoy en el puerto" + app.get("port"));
});

// Middlewares
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

//Archivo estatico
app.use(express.static(path.join(__dirname, "../public")));



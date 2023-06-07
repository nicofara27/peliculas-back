import { Router } from "express";
import {
  crearUsuario,
  elimiarDeLista,
  login,
  obtenerListaPeliculas,
} from "../controllers/usuarios.controllers";
import { check } from "express-validator";
import { editarLista } from "../controllers/usuarios.controllers";
const router = Router();

router
  .route("/")
  .post(
    [
      check("email")
        .notEmpty()
        .isEmail()
        .isLength({ min: 15, max: 80 })
        .withMessage("El email debe tener entre 15 y 80 caracteres"),
      check("contrasenia")
        .notEmpty()
        .isLength({ min: 8, max: 60 })
        .withMessage("La contraseña debe tener entre 8 y 60 caracteres"),
    ],
    login
  );

router
  .route("/nuevo")
  .post(
    [
      check("nombreUsuario")
        .notEmpty()
        .isLength({ min: 6, max: 16 })
        .withMessage("El nombre usuario debe tener entre 6 y 16 caracteres"),
      check("email")
        .notEmpty()
        .isEmail()
        .isLength({ min: 15, max: 80 })
        .withMessage("El email debe tener entre 15 y 80 caracteres"),
      check("contrasenia")
        .notEmpty()
        .isLength({ min: 8, max: 60 })
        .withMessage("La contraseña debe tener entre 8 y 60 caracteres"),
      check("lista").isArray(),
    ],
    crearUsuario
  );

router
  .route("/:nombreUsuario")
  .put(editarLista)
  .get(obtenerListaPeliculas)

router
.route("/:nombreUsuario/:pelicula")
.put(elimiarDeLista);

export default router;

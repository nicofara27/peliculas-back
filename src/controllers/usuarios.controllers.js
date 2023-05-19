import { validationResult } from "express-validator";
import Usuario from "../models/usuario";
import bcrypt from "bcryptjs";

export const crearUsuario = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }


    // Comprueba si el nombre de usuario y el email ya existen
    const { email, nombreUsuario, contrasenia } = req.body;
    let usuario = await Usuario.findOne({ email });
    let nombreBuscado = await Usuario.findOne({ nombreUsuario });

    if (usuario) {
      return res.status(400).json({
        mensaje: "Ya existe una cuenta con este email",
      });
    } else if (nombreBuscado) {
      return res.status(400).json({
        mensaje: "Ya existe una cuenta con este nombre de usuario",
      });
    }

    // Crea el usuario
    usuario = new Usuario(req.body);
    const salt = bcrypt.genSaltSync();
    usuario.contrasenia = bcrypt.hashSync(contrasenia, salt)
    await usuario.save();

    res.status(201).json({
      mensaje: "Usuario creado",
      nombreUsuario: usuario.nombreUsuario,
      idUsuario: usuario._id,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      mensaje: "Error al crear la cuenta",
    });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, contrasenia } = req.body;

    let usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        mensaje: "Correo o contraseña invalido",
      });
    }

    const contraseniaValida = bcrypt.compareSync(contrasenia, usuario.contrasenia);
    if (!contraseniaValida) {
      return res.status(400).json({
        mensaje: "Correo o contrasenia invalida",
      });
    }

    res.status(200).json({
      idUsuario: usuario._id,
      nombreUsuario: usuario.nombre,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      mensaje: "No se pudo crear correctamente el usuario",
    });
  }
};

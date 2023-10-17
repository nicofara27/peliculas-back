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
    usuario.contrasenia = bcrypt.hashSync(contrasenia, salt);
    await usuario.save();

    res.status(201).json({
      mensaje: "Usuario creado",
      nombreUsuario: usuario.nombreUsuario,
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

    const { email, contrasenia, nombreUsuario } = req.body;

    let usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        mensaje: "Correo o contraseña invalido",
      });
    }

    const contraseniaValida = bcrypt.compareSync(
      contrasenia,
      usuario.contrasenia
    );
    if (!contraseniaValida) {
      return res.status(400).json({
        mensaje: "Correo o contrasenia invalida",
      });
    }

    res.status(200).json({
      nombre: usuario.nombreUsuario,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      mensaje: "No se pudo crear correctamente el usuario",
    });
  }
};

export const obtenerListaPeliculas = async (req, res) => {
  const nombreUsuario = req.params.nombreUsuario;
  try {
    const listaPeliculas = await Usuario.find({ nombreUsuario });
    res.status(200).json(listaPeliculas[0].lista);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      mensaje: "Error al buscar la lista",
    });
  }
};

// Funcion que agrega una pelicula a la lista de peliculas de cada usuario
export const editarLista = async (req, res) => {
  const nombreUsuario = req.params.nombreUsuario;
  const nuevaPelicula = req.body;
  const usuario = await Usuario.findOne({ nombreUsuario });
  // Si la pelicula no se encuentra en la lista la agrega
  try {
    if (
      !usuario.lista.find(
        ({ nombrePelicula }) => nombrePelicula === nuevaPelicula.nombrePelicula
      )
    ) {
      await Usuario.findOneAndUpdate(
        { nombreUsuario },
        {
          $addToSet: { lista: nuevaPelicula },
        }
      );

      res.status(200).json({
        mensaje: "Se edito la lista correctamente",
      });
    } else {
      res.status(409).json({
        mensaje: "La pelicula ya se encuentra en la lista",
      });
    }
  } catch (error) {
    console.log(error);

    res.status(400).json({
      mensaje: "Error al editar la lista",
    });
  }
};

// Funcion que agrega una pelicula a la lista de peliculas de cada usuario
export const elimiarDeLista = async (req, res) => {
  const nombreUsuario = req.params.nombreUsuario;
  const peliculaABorrar = req.body;

  // Si la pelicula no se encuentra en la lista la agrega
  try {
    await Usuario.findOneAndUpdate(
      { nombreUsuario },
      {
        $pull: { lista: { key: peliculaABorrar.key } },
      }
    );
  } catch (error) {
    console.log(error);

    res.status(404).json({
      mensaje: "Error al elimniar de la lista",
    });
  }
};

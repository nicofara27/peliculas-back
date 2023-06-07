import mongoose, { Schema } from "mongoose";

const usuarioSchema = new Schema({
  nombreUsuario: {
    type: String,
    required: true,
    unique: [true, "El nombre de usuario debe ser unico, este ya existe."],
    minLength: 6,
    maxLength: 16,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "El email debe ser unico, este ya existe."],
    minLength: 15,
    maxLength: 80,
  },
  contrasenia: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 60,
  },
  lista: [
    {
      key: {
        type: Number
      },
      imagen: {
        type: String,
      },
      nombrePelicula: {
        type: String,
      },
      puntuacion: {
        type: Number,
        min: 0,
        max: 10,
      },
    }
  ],
});

const Usuario = mongoose.model("usuario", usuarioSchema);

export default Usuario;

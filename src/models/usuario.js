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
    minLength: 8,
    maxLength: 16,
  },
});

const Usuario = mongoose.model("usuario", usuarioSchema);

export default Usuario;

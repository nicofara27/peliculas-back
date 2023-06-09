import mongoose from "mongoose";

const url = "mongodb+srv://nicofara:38489829@cluster0.r9qqgtk.mongodb.net/peliculas";

mongoose.connect(url);

const connection = mongoose.connection;

connection.once('open', ()=>{
    console.log('BD conectada')
})
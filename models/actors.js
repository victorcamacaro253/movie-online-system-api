import { Schema, model } from "mongoose";

const actorSchema = new Schema({
  name: { 
    type: String, 
    unique: true, 
    required: true,
    collation: { locale: 'en', strength: 2 } 
  },
  image: {
    type: String,
    required: true
  }
  // Add other fields as necessary
});

const Actor = model("Actor", actorSchema);

export default Actor;
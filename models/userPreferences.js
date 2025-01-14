import { Schema,model } from "mongoose";


const userPreferencesSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId, // Referencia a otra colección, probablemente "users"
      required: true,
      ref: 'User', // Nombre de la colección de usuarios (si existe)
    },
    preferredGenres: {
      type: [String], // Array de cadenas para almacenar los géneros preferidos
      required: true,
      validate: {
        validator: function (genres) {
          // Verifica que el array no esté vacío
          return genres && genres.length > 0;
        },
        message: 'Preferred genres must contain at least one genre.',
      },
    },
    favoriteActors: {
      type: [Schema.Types.ObjectId], // Array de ObjectIds que probablemente se refieren a actores
      ref: 'Actor', // Nombre de la colección de actores (si existe)
      default: [], // Valor predeterminado como un array vacío
    },
  },
  {
    timestamps: true, // Agrega automáticamente los campos `createdAt` y `updatedAt`
  }
);

const userPreferences = model('userPreferences', userPreferencesSchema);

export default userPreferences;
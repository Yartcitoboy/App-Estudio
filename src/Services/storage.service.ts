import { Note } from "../Models/Note";

const STORAGE_KEY = "notas";
const CARRERA_KEY = "cybernotes_carrera";

export const storageService = {
  // ✅ Funciones de Notas (Ahora dentro del objeto)
  loadNotes: (): Note[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveNotes: (notas: Note[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notas));
  },

  // ✅ Funciones de Carrera
  getCarrera: (): string => {
    return localStorage.getItem(CARRERA_KEY) || "";
  },

  setCarrera: (carrera: string): void => {
    localStorage.setItem(CARRERA_KEY, carrera);
  }
};
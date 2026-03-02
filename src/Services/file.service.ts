import { Note } from "../Models/Note";

export const fileService = {
  importarTxtOMd: (file: File): Promise<Partial<Note>> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const contenido = e.target?.result as string;
        resolve({
          titulo: file.name.replace(/\.[^/.]+$/, ""),
          contenido: contenido,
          asignatura: "Importado",
          fecha: new Date().toLocaleString()
        });
      };
      reader.onerror = () => reject(new Error("Error al leer archivo"));
      reader.readAsText(file);
    });
  }
};
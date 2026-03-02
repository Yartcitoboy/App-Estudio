import { useState, useEffect } from "react";
import { Note } from "../Models/Note";
import { storageService } from "../Services/storage.service"; // ✅ Importar el objeto completo

export const useNotes = (busqueda: string) => {
  const [notas, setNotas] = useState<Note[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const init = async () => {
      // ✅ Llamada corregida
      const guardadas = storageService.loadNotes(); 
      setNotas(guardadas || []);
      setLoaded(true);
    };
    init();
  }, []);

  useEffect(() => {
    if (loaded) {
      // ✅ Llamada corregida
      storageService.saveNotes(notas); 
    }
  }, [notas, loaded]);

  const addNote = (note: Note) => setNotas([note, ...notas]);
  const updateNote = (updated: Note) =>
    setNotas(notas.map((n) => (n.id === updated.id ? updated : n)));
  const deleteNote = (id: number) => setNotas(notas.filter((n) => n.id !== id));

  const filteredNotas = notas.filter((n) =>
    n.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const asignaturas = [...new Set(notas.map((n) => n.asignatura).filter(Boolean))];

  return {
    notas,
    filteredNotas,
    asignaturas,
    addNote,
    updateNote,
    deleteNote,
    setNotas,
  };
};
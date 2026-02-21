/**
 * Storage utilities for persisting notes locally using Electron IPC
 * Data is saved to disk and works across different PCs/devices
 */

interface Nota {
  id: number;
  asignatura: string;
  titulo: string;
  contenido: string;
  fecha: string;
}

// Type declaration for ipcRenderer - omitted to avoid conflicts with preload.ts

/**
 * Load notes from local storage (persisted via Electron IPC)
 */
export async function loadNotes(): Promise<Nota[]> {
  try {
    if (window.ipcRenderer) {
      const notas = await window.ipcRenderer.invoke("load-notes");
      return notas || [];
    }
    // Fallback for development (localStorage)
    const saved = localStorage.getItem("notas_estudio_ia");
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Error loading notes:", error);
    return [];
  }
}

/**
 * Save notes to local storage (persisted via Electron IPC)
 */
export async function saveNotes(notas: Nota[]): Promise<boolean> {
  try {
    if (window.ipcRenderer) {
      const result = await window.ipcRenderer.invoke("save-notes", notas);
      return result.success || false;
    }
    // Fallback for development (localStorage)
    localStorage.setItem("notas_estudio_ia", JSON.stringify(notas));
    return true;
  } catch (error) {
    console.error("Error saving notes:", error);
    return false;
  }
}

/**
 * Export notes as JSON file for backup
 */
export function exportNotasAsJSON(
  notas: Nota[],
  filename = "notas-backup.json",
) {
  const dataStr = JSON.stringify(notas, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Import notes from JSON file
 */
export async function importNotasFromJSON(file: File): Promise<Nota[] | null> {
  try {
    const text = await file.text();
    const notas = JSON.parse(text);

    // Validate structure
    if (!Array.isArray(notas)) {
      throw new Error("El archivo debe contener un array de notas");
    }

    return notas;
  } catch (error) {
    console.error("Error importing notes:", error);
    return null;
  }
}

/**
 * Get the data folder location info
 */
export function getDataFolderInfo(): string {
  if (window.ipcRenderer) {
    return "Los datos se guardan en: <app-folder>/user-data/notas.json";
  }
  return "Los datos se guardan en localStorage del navegador";
}

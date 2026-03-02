import { useState, useEffect, useRef } from "react";
import { Search, Save } from "lucide-react";
import "./app.css";

// Componentes de UI
import Header from "../Components/Layout/Header";
import Sidebar from "../Components/Layout/Sidebar";
import NoteList from "../Components/Notes/NoteList";
import SynthesizerPanel from "../Components/IA/SynthesizerPanel";

// Servicios y Hooks
import { useNotes } from "../Hooks/useNotes";
import { pdfService } from "../Services/pdf.service";
import { storageService } from "../Services/storage.service";
import { fetchPersonajes } from "../Services/persona.service";
import { fileService } from "../Services/file.service";

// Modelos
import { Note } from "../Models/Note";
import { Persona } from "../Models/Persona";

export default function App() {
  const [busqueda, setBusqueda] = useState("");
  
  // Hook que maneja el CRUD y filtrado de notas
  const { 
    notas, 
    filteredNotas, 
    asignaturas, 
    addNote, 
    updateNote, 
    deleteNote 
  } = useNotes(busqueda);

  const [dbPersonajes, setDbPersonajes] = useState<Persona[]>([]);
  const [personajeActivo, setPersonajeActivo] = useState<Persona | null>(null);
  const [notaSeleccionada, setNotaSeleccionada] = useState<Note | null>(null);
  const [editandoContenido, setEditandoContenido] = useState("");
  const [idsSeleccionados, setIdsSeleccionados] = useState<number[]>([]);
  
  // Gestión de carrera persistente
  const [carrera, setCarrera] = useState(() => storageService.getCarrera());
  const [mostrarBienvenida, setMostrarBienvenida] = useState(!storageService.getCarrera());

  const notasRef = useRef<Note[]>(notas);

  useEffect(() => {
    notasRef.current = notas;
    if (notaSeleccionada) {
      const actualizada = notas.find((n) => n.id === notaSeleccionada.id);
      if (!actualizada) {
        setNotaSeleccionada(null);
        setEditandoContenido("");
      } else if (actualizada.resumenIA !== notaSeleccionada.resumenIA) {
        setNotaSeleccionada(actualizada);
      }
    }
  }, [notas, notaSeleccionada]);

  useEffect(() => {
    storageService.setCarrera(carrera);
  }, [carrera]);

  useEffect(() => {
    fetchPersonajes().then((p) => {
      setDbPersonajes(p);
      setPersonajeActivo(p[0] || null);
    });
  }, []);

  const handleSelectNote = (n: Note) => {
    if (notaSeleccionada?.id === n.id) {
      setNotaSeleccionada(null);
      setEditandoContenido("");
    } else {
      setNotaSeleccionada(n);
      setEditandoContenido(n.contenido);
    }
  };

  const handleUpdateContent = () => {
    if (!notaSeleccionada) return;
    updateNote({ ...notaSeleccionada, contenido: editandoContenido });
  };

  const handleImportar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const data = await fileService.importarTxtOMd(file);
      addNote({ ...data as Note, id: Date.now() });
    }
  };

  const handleExportarPDF = (resumenIA?: string) => {
    if (!notaSeleccionada) return;
    const notaActual = notasRef.current.find(n => n.id === notaSeleccionada.id) || notaSeleccionada;
    pdfService.exportarNota(notaActual, carrera, resumenIA);
  };

  return (
    <div className="h-screen w-screen text-slate-200 bg-[#02040a] flex flex-col font-sans overflow-hidden">
      <Header />

      {/* Contenedor Principal: Usa 'flex-1' para ocupar todo el alto y 'overflow-hidden' para evitar scrolls globales */}
      <div className="flex flex-1 overflow-hidden w-full">
        
        {/* COLUMNA 1: SIDEBAR (Fija) */}
        <aside className="w-72 flex-shrink-0 border-r border-slate-800/50 bg-[#02040a] h-full overflow-y-auto custom-scroll">
          <Sidebar 
            onSave={addNote} 
            carrera={carrera} 
            onCarreraChange={setCarrera} 
            onImport={handleImportar} 
          />
        </aside>

        {/* COLUMNA 2: CUERPO CENTRAL (Buscador, Lista y Editor) */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#02040a] h-full overflow-hidden border-r border-slate-800/50">
          
          {/* Buscador Superior */}
          <div className="p-4 border-b border-slate-800/50">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 text-slate-600" />
              <input 
                value={busqueda} 
                onChange={(e) => setBusqueda(e.target.value)} 
                placeholder="BUSCAR EN DB..." 
                className="w-full bg-[#0d1117] border border-slate-800 pl-10 py-2 rounded-lg text-xs outline-none focus:border-cyan-900 transition-all" 
              />
            </div>
          </div>

          {/* Área de Notas y Editor */}
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Lista de Notas (Ocupa todo si no hay selección, o mitad superior) */}
            <div className={`${notaSeleccionada ? 'h-1/2' : 'h-full'} overflow-y-auto custom-scroll p-4`}>
              <NoteList 
                notas={filteredNotas} 
                notaSeleccionada={notaSeleccionada} 
                onSelect={handleSelectNote} 
                onDelete={deleteNote}
                idsSeleccionados={idsSeleccionados}
                setIdsSeleccionados={setIdsSeleccionados}
              />
            </div>

            {/* Editor (Mitad inferior) */}
            {notaSeleccionada && (
              <section className="h-1/2 border-t border-slate-800/50 p-6 bg-[#0d1117] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                    Editor: {notaSeleccionada.titulo}
                  </span>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleExportarPDF()} 
                      className="bg-slate-800 border border-slate-700 px-4 py-1.5 rounded-lg text-slate-300 text-[10px] font-black hover:bg-slate-700 transition"
                    >
                      PDF
                    </button>
                    
                    <button 
                      onClick={handleUpdateContent} 
                      className="flex items-center gap-2 bg-cyan-600 border border-cyan-500 px-5 py-1.5 rounded-lg text-white text-[10px] font-black hover:bg-cyan-500 transition-all"
                    >
                      <Save size={14} /> 
                      <span>GUARDAR REGISTRO</span>
                    </button>
                  </div>
                </div>
                <textarea 
                  value={editandoContenido} 
                  onChange={(e) => setEditandoContenido(e.target.value)} 
                  className="flex-1 bg-transparent border border-slate-800/50 p-5 rounded-2xl text-sm outline-none resize-none focus:border-cyan-900/30 transition-all custom-scroll" 
                />
              </section>
            )}
          </div>
        </main>

        {/* COLUMNA 3: PANEL IA (Fijo a la derecha) */}
        {notaSeleccionada && (
            <SynthesizerPanel 
              personajes={dbPersonajes} 
              personajeActivo={personajeActivo} 
              onChangePersonaje={setPersonajeActivo} 
              notas={notas} 
              notaSeleccionada={notaSeleccionada} 
              updateNota={updateNote} 
              asignaturas={asignaturas} 
              carrera={carrera} 
              onExportPDF={handleExportarPDF}
              idsSeleccionados={idsSeleccionados}
            />
        )}
      </div>

      {/* Bienvenida */}
      {mostrarBienvenida && (
        <div className="fixed inset-0 z-50 bg-[#02040a]/95 backdrop-blur-xl flex items-center justify-center">
          <div className="max-w-md w-full bg-[#0d1117] border border-cyan-900/50 p-10 rounded-3xl text-center">
            <h2 className="text-cyan-400 font-black text-3xl mb-4 italic">CYBERNOTES_INIT</h2>
            <input 
              type="text" 
              placeholder="Escribe tu carrera..." 
              className="w-full bg-[#02040a] border border-slate-800 p-4 rounded-xl text-sm outline-none focus:border-cyan-500 transition-all text-center" 
              onKeyDown={(e) => {
                if (e.key === 'Enter') { 
                  setCarrera(e.currentTarget.value); 
                  setMostrarBienvenida(false); 
                }
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
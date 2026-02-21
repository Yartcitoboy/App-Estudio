import { useState, useEffect, useRef } from "react";
import { Trash2, Search, Plus, X, Maximize2, Minimize2 } from "lucide-react";
import "./app.css";
import { loadNotes, saveNotes } from "./utils/storage";

// ... (Interface Nota y estados iniciales se mantienen igual)
interface Nota {
  id: number;
  asignatura: string;
  titulo: string;
  contenido: string;
  fecha: string;
  resumenIA?: string;
}

function App() {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [notasLoaded, setNotasLoaded] = useState(false);
  const [asignatura, setAsignatura] = useState("");
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [misAsignaturas, setMisAsignaturas] = useState<string[]>(["General", "Redes", "Pentesting"]);
  const [nuevaAsigInput, setNuevaAsigInput] = useState("");
  const [notaSeleccionada, setNotaSeleccionada] = useState<Nota | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [asignaturaFiltro, setAsignaturaFiltro] = useState("");
  const [cargando, setCargando] = useState(false);

  // NUEVO: Estado para el modo de escritura expandido
  const [isExpanded, setIsExpanded] = useState(false);

  // Cargar y guardar notas (mismo efecto anterior)
  useEffect(() => {
    const cargarDatos = async () => {
      const notasGuardadas = await loadNotes();
      setNotas(notasGuardadas);
      const asigsExistentes = Array.from(new Set([...misAsignaturas, ...notasGuardadas.map(n => n.asignatura)]));
      setMisAsignaturas(asigsExistentes);
      setNotasLoaded(true);
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    if (notasLoaded) saveNotes(notas).catch(err => console.error(err));
  }, [notas, notasLoaded]);

  const agregarAsignatura = () => {
    if (nuevaAsigInput.trim() && !misAsignaturas.includes(nuevaAsigInput.trim())) {
      setMisAsignaturas([...misAsignaturas, nuevaAsigInput.trim()]);
      setAsignatura(nuevaAsigInput.trim());
      setNuevaAsigInput("");
    }
  };

  const guardarNota = () => {
    if (!titulo.trim() || !asignatura.trim() || !contenido.trim()) return alert("Completa los campos.");
    const nuevaNota: Nota = {
      id: Date.now(),
      asignatura,
      titulo,
      contenido,
      fecha: new Date().toLocaleString("es-ES"),
    };
    setNotas([nuevaNota, ...notas]);
    setTitulo("");
    setContenido("");
    setIsExpanded(false); // Cerrar si estaba expandido
    alert("✅ Nota guardada");
  };

  const generarResumenNota = async (nota: Nota) => {
    setCargando(true);
    try {
      const response = await fetch("http://localhost:3001/api/resumen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: `Resume esto: ${nota.contenido}` }),
      });
      const data = await response.json();
      const actualizadas = notas.map(n => n.id === nota.id ? { ...n, resumenIA: data.texto } : n);
      setNotas(actualizadas);
      setNotaSeleccionada({ ...nota, resumenIA: data.texto });
    } catch (e) { alert("Error con la IA"); } finally { setCargando(false); }
  };

  const eliminarNota = (id: number) => {
    if (window.confirm("¿Eliminar?")) {
      setNotas(notas.filter(n => n.id !== id));
      if (notaSeleccionada?.id === id) setNotaSeleccionada(null);
    }
  };

  const notasFiltradas = notas.filter(n => (n.titulo + n.contenido).toLowerCase().includes(busqueda.toLowerCase()) && (!asignaturaFiltro || n.asignatura === asignaturaFiltro));
  const agrupadas = notasFiltradas.reduce((acc: any, n) => { (acc[n.asignatura] = acc[n.asignatura] || []).push(n); return acc; }, {});

  return (
    <div className="min-h-screen text-slate-200 bg-[#030617] flex flex-col font-sans overflow-hidden">
      
      {/* MODAL DE ESCRITURA EXPANDIDA */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-[#030617] p-8 flex flex-col animate-in fade-in zoom-in duration-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-cyan-400 font-bold tracking-widest uppercase">Modo Enfoque</h2>
            <button onClick={() => setIsExpanded(false)} className="text-slate-400 hover:text-white p-2">
              <Minimize2 size={24} />
            </button>
          </div>
          <input
            type="text"
            placeholder="Título de la nota..."
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="bg-transparent text-3xl font-bold border-none outline-none mb-6 text-white placeholder-slate-700"
          />
          <textarea
            placeholder="Escribe todo lo que necesites aquí..."
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-lg outline-none resize-none custom-scroll"
          />
          <div className="mt-6 flex justify-end gap-4">
            <button onClick={() => setIsExpanded(false)} className="px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 transition">Cancelar</button>
            <button onClick={guardarNota} className="px-8 py-3 rounded-xl bg-cyan-600 font-bold hover:bg-cyan-500 transition">Guardar Cambios</button>
          </div>
        </div>
      )}

      <header className="border-b border-slate-800 px-6 py-4 flex justify-between items-center bg-[#030617]/80 backdrop-blur-md z-10">
        <h1 className="text-xl font-bold text-blue-400 tracking-tighter italic">CYBERNOTES</h1>
        <div className="flex items-center gap-4">
           <span className="text-[10px] text-slate-500 font-mono uppercase">Status: Online</span>
           <div className="bg-slate-900 px-4 py-1 rounded-full border border-slate-700 text-xs text-cyan-400">{notas.length} DB_ENTRIES</div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Izquierda */}
        <aside className="w-80 border-r border-slate-800 p-6 space-y-5 overflow-y-auto">
          <div className="flex justify-between items-center">
            <h2 className="text-xs text-cyan-400 font-bold uppercase tracking-widest">Editor</h2>
            <button onClick={() => setIsExpanded(true)} className="text-slate-500 hover:text-cyan-400 transition" title="Expandir editor">
              <Maximize2 size={14} />
            </button>
          </div>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Título..."
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-cyan-500 outline-none"
            />
            
            <div className="relative group">
              <textarea
                placeholder="Contenido..."
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                rows={isExpanded ? 1 : 8}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-cyan-500 outline-none resize-none transition-all duration-300"
              />
              <button 
                onClick={() => setIsExpanded(true)}
                className="absolute bottom-2 right-2 p-1 bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white"
              >
                <Maximize2 size={12} />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 uppercase font-bold">Asignatura</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nueva..."
                  value={nuevaAsigInput}
                  onChange={(e) => setNuevaAsigInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-xs outline-none focus:border-cyan-800"
                />
                <button onClick={agregarAsignatura} className="p-2 bg-slate-800 rounded-lg hover:text-cyan-400">
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {misAsignaturas.map((asig) => (
                  <button
                    key={asig}
                    onClick={() => setAsignatura(asig)}
                    className={`px-2.5 py-1 rounded text-[9px] font-bold border transition ${
                      asignatura === asig ? "bg-cyan-900/40 border-cyan-500 text-cyan-100" : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600"
                    }`}
                  >
                    {asig}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={guardarNota} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 py-3 rounded-lg text-xs font-black tracking-widest transition shadow-lg shadow-cyan-900/20">
              GUARDAR EN MEMORIA
            </button>
          </div>
        </aside>

        {/* Centro - Lista de Notas */}
        <main className="flex-1 border-r border-slate-800 p-6 flex flex-col overflow-hidden bg-[#030617]/40">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3 w-4 h-4 text-slate-600" />
              <input
                type="text"
                placeholder="Buscar en el sistema..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-12 py-2.5 text-sm outline-none focus:border-cyan-900 focus:bg-slate-900 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scroll">
            {Object.entries(agrupadas).map(([asig, notasAsig]: any) => (
              <div key={asig} className="space-y-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-[10px] font-black text-cyan-500 tracking-[0.3em] uppercase">{asig}</h3>
                  <div className="flex-1 h-[1px] bg-gradient-to-r from-cyan-900/50 to-transparent"></div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {notasAsig.map((nota: Nota) => (
                    <div
                      key={nota.id}
                      onClick={() => setNotaSeleccionada(nota)}
                      className={`p-5 rounded-2xl border transition-all duration-300 group ${
                        notaSeleccionada?.id === nota.id ? "bg-slate-800/80 border-cyan-500 shadow-xl shadow-cyan-900/10" : "bg-slate-900/30 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">{nota.titulo}</h4>
                        <button onClick={(e) => { e.stopPropagation(); eliminarNota(nota.id); }} className="text-slate-700 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-600 font-mono mb-3">{nota.fecha}</p>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed italic">"{nota.contenido}"</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Derecha - Cerebro IA */}
        <aside className="w-96 p-6 flex flex-col overflow-hidden bg-[#030617]">
          <h2 className="text-xs text-cyan-400 font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
            Cerebro IA
          </h2>
          
          {notaSeleccionada ? (
            <div className="flex flex-col h-full space-y-4">
              <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl border-l-4 border-l-cyan-500">
                <span className="text-[9px] text-cyan-600 font-black uppercase tracking-tighter">{notaSeleccionada.asignatura}</span>
                <h3 className="font-bold text-base truncate text-white">{notaSeleccionada.titulo}</h3>
              </div>

              <button
                onClick={() => generarResumenNota(notaSeleccionada)}
                disabled={cargando}
                className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 py-3 rounded-xl text-[10px] font-black tracking-widest transition disabled:opacity-30 group"
              >
                {cargando ? "DECODIFICANDO..." : "SINTETIZAR INFORMACIÓN"}
              </button>

              <div className="flex-1 bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6 overflow-y-auto custom-scroll relative">
                {notaSeleccionada.resumenIA ? (
                  <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap animate-in slide-in-from-bottom-2 duration-500">
                    <div className="text-cyan-500 font-mono mb-4 text-[9px] border-b border-cyan-900/30 pb-2">RESUMEN_LOG:</div>
                    {notaSeleccionada.resumenIA}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                    <p className="text-[10px] uppercase tracking-widest">Esperando señal...</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-10">
               <div className="text-6xl mb-4">🧠</div>
               <p className="text-[10px] font-black tracking-[0.5em]">SYSTEM IDLE</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default App;
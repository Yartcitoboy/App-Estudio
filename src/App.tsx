import { useState, useEffect } from "react";
import { Trash2, Search, Plus, X, Maximize2, Save, Brain, Minimize2 } from "lucide-react";
import "./app.css";
import { loadNotes, saveNotes } from "./utils/storage";

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
  
  const [asignatura, setAsignatura] = useState("General");
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [misAsignaturas, setMisAsignaturas] = useState<string[]>(["General", "Redes", "Pentesting"]);
  const [nuevaAsigInput, setNuevaAsigInput] = useState("");
  
  const [notaSeleccionada, setNotaSeleccionada] = useState<Nota | null>(null);
  const [editandoContenido, setEditandoContenido] = useState("");
  const [idsSeleccionados, setIdsSeleccionados] = useState<number[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [nombreIA, setNombreIA] = useState("Kiyotaka Ayanokōji");
  const [personalidadIA, setPersonalidadIA] = useState("frío, analítico y extremadamente eficiente");
  const [showConfigIA, setShowConfigIA] = useState(false);

  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      const guardadas = await loadNotes();
      setNotas(guardadas || []);
      setNotasLoaded(true);
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    if (notasLoaded) saveNotes(notas);
  }, [notas, notasLoaded]);

  // CRUD Asignaturas mejorado
  const agregarAsignatura = () => {
    const nueva = nuevaAsigInput.trim();
    if (nueva && !misAsignaturas.includes(nueva)) {
      setMisAsignaturas([...misAsignaturas, nueva]);
      setAsignatura(nueva);
      setNuevaAsigInput("");
    }
  };

  const eliminarAsignatura = (asig: string) => {
    if (asig === "General") return;
    setMisAsignaturas(misAsignaturas.filter(a => a !== asig));
    if (asignatura === asig) setAsignatura("General");
  };

  const guardarNuevaNota = () => {
    if (!titulo.trim() || !contenido.trim()) return alert("Faltan datos.");
    const nuevaNota: Nota = {
      id: Date.now(),
      asignatura,
      titulo: titulo.trim(),
      contenido: contenido.trim(),
      fecha: new Date().toLocaleString("es-ES"),
    };
    setNotas([nuevaNota, ...notas]);
    setTitulo(""); setContenido("");
    setIsExpanded(false);
  };

  const actualizarNota = () => {
    if (!notaSeleccionada) return;
    const nuevasNotas = notas.map(n => n.id === notaSeleccionada.id ? { ...n, contenido: editandoContenido } : n);
    setNotas(nuevasNotas);
    setNotaSeleccionada({ ...notaSeleccionada, contenido: editandoContenido });
  };

  // NUEVO: Validación de identidad
  const generarResumenIA = async () => {
    setCargando(true);
    const seleccionadas = notas.filter(n => idsSeleccionados.includes(n.id));
    const contexto = seleccionadas.length > 0 ? seleccionadas : (notaSeleccionada ? [notaSeleccionada] : []);
    
    if (contexto.length === 0) { setCargando(false); return; }

    // Prompt con instrucción de seguridad de identidad
    const prompt = `Instrucción crítica: Debes actuar estrictamente como el personaje "${nombreIA}". 
    Su personalidad es: ${personalidadIA}. 
    Si no conoces a este personaje o el nombre parece mal escrito, responde como un Asistente Técnico Neutro informando del error de identidad. 
    Analiza estas notas: ${contexto.map(n => n.contenido).join("\n")}`;

    try {
      const response = await fetch("http://localhost:3001/api/resumen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      
      if (notaSeleccionada) {
        setNotas(notas.map(n => n.id === notaSeleccionada.id ? { ...n, resumenIA: data.texto } : n));
        setNotaSeleccionada({ ...notaSeleccionada, resumenIA: data.texto });
      }
    } catch (e) {
      alert("Error de conexión neuronal.");
    } finally {
      setCargando(false);
    }
  };

  const eliminarNota = (id: number) => {
    if (window.confirm("¿Eliminar registro?")) {
      setNotas(notas.filter(n => n.id !== id));
      if (notaSeleccionada?.id === id) setNotaSeleccionada(null);
    }
  };

  return (
    <div className="min-h-screen text-slate-200 bg-[#02040a] flex flex-col font-sans overflow-hidden">
      
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-[#02040a] p-8 flex flex-col animate-in fade-in zoom-in duration-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-cyan-400 font-bold uppercase tracking-widest">Editor de Alto Nivel</h2>
            <button onClick={() => setIsExpanded(false)}><Minimize2 size={24} /></button>
          </div>
          <input value={titulo} onChange={e => setTitulo(e.target.value)} className="bg-transparent text-3xl font-bold border-none outline-none mb-6 text-white" placeholder="Título..." />
          <textarea value={contenido} onChange={e => setContenido(e.target.value)} className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-lg outline-none resize-none custom-scroll" placeholder="Contenido..." />
          <div className="mt-6 flex justify-end gap-4">
            <button onClick={() => setIsExpanded(false)} className="px-6 py-3 rounded-xl border border-slate-700">Cancelar</button>
            <button onClick={guardarNuevaNota} className="px-8 py-3 rounded-xl bg-cyan-600 font-bold">Guardar</button>
          </div>
        </div>
      )}

      <header className="border-b border-slate-800 px-6 py-4 flex justify-between items-center bg-[#0d1117]">
        <h1 className="text-xl font-black text-cyan-500 italic">CYBERNOTES</h1>
        <button onClick={() => setShowConfigIA(!showConfigIA)} className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-md text-xs border border-slate-700">
          <Brain size={14}/> {nombreIA}
        </button>
      </header>

      {showConfigIA && (
        <div className="bg-[#161b22] border-b border-cyan-900/30 p-4 flex gap-4 animate-in slide-in-from-top">
          <div className="flex-1">
            <label className="text-[10px] uppercase text-slate-500 font-bold">Personaje (Nombre Exacto)</label>
            <input value={nombreIA} onChange={e => setNombreIA(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm mt-1 outline-none" />
          </div>
          <div className="flex-2">
            <label className="text-[10px] uppercase text-slate-500 font-bold">Directriz de Personalidad</label>
            <input value={personalidadIA} onChange={e => setPersonalidadIA(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm mt-1 outline-none" />
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 border-r border-slate-800 p-6 flex flex-col gap-4 overflow-y-auto">
          <div className="flex justify-between items-center">
            <h2 className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Entrada</h2>
            <button onClick={() => setIsExpanded(true)} className="text-slate-500 hover:text-cyan-400"><Maximize2 size={14} /></button>
          </div>
          <input placeholder="Título..." value={titulo} onChange={e => setTitulo(e.target.value)} className="bg-slate-900 border border-slate-800 p-2 rounded text-sm outline-none" />
          <textarea placeholder="Contenido..." value={contenido} onChange={e => setContenido(e.target.value)} rows={6} className="bg-slate-900 border border-slate-800 p-2 rounded text-sm outline-none resize-none" />
          
          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 uppercase font-bold">Asignatura</label>
            <div className="flex gap-2">
              <input value={nuevaAsigInput} onChange={e => setNuevaAsigInput(e.target.value)} placeholder="Nueva..." className="flex-1 bg-slate-900 border border-slate-800 p-1 px-2 rounded text-xs outline-none" />
              <button onClick={agregarAsignatura} className="p-1 bg-slate-800 rounded"><Plus size={14}/></button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {misAsignaturas.map(a => (
                <div key={a} className="group relative">
                  <button onClick={() => setAsignatura(a)} className={`px-2 py-1 rounded text-[9px] font-bold border ${asignatura === a ? "bg-cyan-900/40 border-cyan-500 text-cyan-100" : "bg-slate-900 border-slate-800 text-slate-500"}`}>{a}</button>
                  {a !== "General" && <button onClick={() => eliminarAsignatura(a)} className="absolute -top-1 -right-1 bg-red-600 rounded-full p-0.5 opacity-0 group-hover:opacity-100"><X size={8}/></button>}
                </div>
              ))}
            </div>
          </div>
          <button onClick={guardarNuevaNota} className="bg-cyan-600 py-3 rounded text-[10px] font-black tracking-widest hover:bg-cyan-500 transition">REGISTRAR NOTA</button>
        </aside>

        <main className="flex-1 flex flex-col border-r border-slate-800 bg-[#030617]/30">
          <div className="p-4 border-b border-slate-800">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-600" />
              <input type="text" placeholder="BUSCAR..." value={busqueda} onChange={e => setBusqueda(e.target.value)} className="w-full bg-slate-900 pl-10 pr-4 py-2 rounded-lg text-xs outline-none border border-slate-800" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scroll">
            {notas.filter(n => n.titulo.toLowerCase().includes(busqueda.toLowerCase())).map(n => (
              <div key={n.id} onClick={() => { setNotaSeleccionada(n); setEditandoContenido(n.contenido); }} className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-4 ${notaSeleccionada?.id === n.id ? "border-cyan-500 bg-slate-800/50" : "border-slate-800 bg-slate-900/30"}`}>
                <input type="checkbox" checked={idsSeleccionados.includes(n.id)} onChange={(e) => { e.stopPropagation(); setIdsSeleccionados(prev => prev.includes(n.id) ? prev.filter(i => i !== n.id) : [...prev, n.id]); }} className="w-4 h-4 rounded accent-cyan-500" />
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-sm font-bold">{n.titulo}</h4>
                  <p className="text-[9px] text-cyan-600 font-black uppercase">{n.asignatura} | {n.fecha}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); eliminarNota(n.id); }} className="p-2 text-slate-600 hover:text-red-500"><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
          {notaSeleccionada && (
            <div className="h-1/2 border-t border-slate-800 p-5 bg-[#0d1117] flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black text-slate-500 uppercase">Edición de Registro</span>
                <button onClick={actualizarNota} className="bg-cyan-900/30 border border-cyan-800 px-4 py-1.5 rounded-lg text-cyan-400 text-[10px] font-black hover:bg-cyan-900/50 transition">
                  <Save size={14} className="inline mr-2"/>GUARDAR CAMBIOS
                </button>
              </div>
              <textarea value={editandoContenido} onChange={e => setEditandoContenido(e.target.value)} className="flex-1 bg-slate-900/50 border border-slate-800 p-4 rounded-xl text-sm outline-none resize-none custom-scroll" />
            </div>
          )}
        </main>

        <aside className="w-80 p-6 flex flex-col bg-[#02040a]">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-xl text-white font-black">{nombreIA[0]}</div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest">{nombreIA}</h3>
              <p className="text-[9px] text-cyan-500 font-mono uppercase animate-pulse">Neural_Link: Active</p>
            </div>
          </div>
          <div className="flex-1 bg-slate-900/20 border border-slate-800/50 rounded-2xl p-5 overflow-y-auto custom-scroll relative">
            {cargando ? <div className="animate-spin w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mt-20"></div> : 
            <p className="text-xs text-slate-400 whitespace-pre-wrap">{notaSeleccionada?.resumenIA || "Inicia el análisis..."}</p>}
          </div>
          <button onClick={generarResumenIA} className="mt-6 bg-slate-900 border border-cyan-900 text-cyan-500 py-3 rounded-xl text-[10px] font-black tracking-widest hover:bg-cyan-950 transition">SINTETIZAR DATOS</button>
        </aside>
      </div>
    </div>
  );
}

export default App;
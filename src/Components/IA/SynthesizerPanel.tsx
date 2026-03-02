import React, { useState, useEffect } from "react";
import { Search, Users } from "lucide-react";
import { Persona } from "../../Models/Persona";
import { Note } from "../../Models/Note";
import { generateSummary, buildPrompt } from "../../Services/ai.service";
import SystemOutput from "../Layout/SystemOutput";

interface SynthesizerPanelProps {
  personajes: Persona[];
  personajeActivo: Persona | null;
  onChangePersonaje: (p: Persona) => void;
  notas: Note[];
  notaSeleccionada: Note | null;
  idsSeleccionados: number[];
  updateNota: (note: Note) => void;
  asignaturas: string[];
  carrera: string;
  onExportPDF: (resumen: string) => void; // ✅ añadida
}

export const SynthesizerPanel: React.FC<SynthesizerPanelProps> = ({
  personajes,
  personajeActivo,
  onChangePersonaje,
  notas,
  notaSeleccionada,
  idsSeleccionados,
  updateNota,
  asignaturas,
  carrera,
}) => {
  const [showGaleria, setShowGaleria] = useState(false);
  const [busquedaPersonaje, setBusquedaPersonaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [textoResumenLocal, setTextoResumenLocal] = useState<string | undefined>(undefined);

  useEffect(() => {
    setTextoResumenLocal(notaSeleccionada?.resumenIA);
  }, [notaSeleccionada?.id]);

  const personajesFiltrados = personajes.filter((p) =>
    p.nombre.toLowerCase().includes(busquedaPersonaje.toLowerCase()),
  );

  const manejarResumen = async () => {
    if (!personajeActivo) return;

    const seleccionadas = notas.filter((n) => idsSeleccionados.includes(n.id));
    const contexto =
      seleccionadas.length > 0
        ? seleccionadas
        : notaSeleccionada
          ? [notaSeleccionada]
          : [];

    if (contexto.length === 0) {
      alert("Selecciona al menos una nota para sintetizar");
      return;
    }

    setCargando(true);

    try {
      const prompt = buildPrompt(personajeActivo, asignaturas, carrera, contexto);
      const texto = await generateSummary(prompt);

      setTextoResumenLocal(texto); // ✅ UI inmediata

      // ✅ updateNota recibe Note completo, no (id, partial)
      contexto.forEach((nota: Note) => {
        updateNota({ ...nota, resumenIA: texto }); // ✅ texto, no textoGenerado
      });
    } catch (e) {
      console.error(e);
      alert("Error Neural Link — Revisa la conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <aside className="w-80 p-6 flex flex-col bg-[#02040a] relative">
      {personajeActivo && (
        <div className="relative mb-6">
          <button
            onClick={() => setShowGaleria(!showGaleria)}
            className="w-full flex items-center justify-between bg-slate-900 border border-slate-800 p-2 rounded-xl hover:border-cyan-900 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-lg border border-slate-700">
                {personajeActivo.avatar}
              </div>
              <div className="text-left">
                <h3 className="text-[10px] font-black text-white uppercase">
                  {personajeActivo.nombre}
                </h3>
              </div>
            </div>
            <Users className="text-slate-600" size={14} />
          </button>

          {showGaleria && (
            <div className="absolute top-12 left-0 right-0 z-30 bg-[#0d1117] border border-slate-800 rounded-xl shadow-2xl p-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="relative mb-3">
                <Search className="absolute left-2 top-2 w-3 text-slate-600" />
                <input
                  autoFocus
                  value={busquedaPersonaje}
                  onChange={(e) => setBusquedaPersonaje(e.target.value)}
                  placeholder="Buscar personaje..."
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 pl-7 text-[10px] outline-none focus:border-cyan-900"
                />
              </div>
              <div className="max-h-48 overflow-y-auto custom-scroll space-y-1">
                {personajesFiltrados.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onChangePersonaje(p);
                      setShowGaleria(false);
                      setBusquedaPersonaje("");
                    }}
                    className={`w-full p-2 rounded-lg flex items-center gap-3 transition ${
                      personajeActivo.id === p.id
                        ? "bg-cyan-900/20 text-cyan-400"
                        : "hover:bg-slate-800 text-slate-400"
                    }`}
                  >
                    <span className="text-sm">{p.avatar}</span>
                    <span className="text-[10px] font-bold truncate">{p.nombre}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex-1 min-h-0 bg-slate-900/20 border border-slate-800/50 rounded-2xl relative">
        <div className="absolute inset-0 p-5 overflow-y-auto custom-scroll">
          <SystemOutput
            cargando={cargando}
            texto={textoResumenLocal}
            nombrePersonaje={personajeActivo?.nombre}
          />
        </div>
      </div>

      <button
        onClick={manejarResumen}
        disabled={cargando}
        className="mt-6 bg-slate-900 border border-cyan-900 text-cyan-500 py-3 rounded-xl text-[10px] font-black tracking-widest hover:bg-cyan-950 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {cargando ? "PROCESANDO..." : "SINTETIZAR"}
      </button>
    </aside>
  );
};

export default SynthesizerPanel;
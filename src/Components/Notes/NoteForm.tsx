import { useState } from "react";
import { Plus, X, Maximize2, Minimize2 } from "lucide-react";
import { Note } from "../../Models/Note";

interface NoteFormProps {
  onSave: (note: Note) => void;
}

export const NoteForm: React.FC<NoteFormProps> = ({ onSave }) => {
  const [asignatura, setAsignatura] = useState("General");
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [misAsignaturas, setMisAsignaturas] = useState<string[]>([
    "General",
    "Redes",
    "Pentesting",
  ]);
  const [nuevaAsigInput, setNuevaAsigInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const agregarAsignatura = () => {
    const n = nuevaAsigInput.trim();
    if (n && !misAsignaturas.includes(n)) {
      setMisAsignaturas([...misAsignaturas, n]);
      setAsignatura(n);
      setNuevaAsigInput("");
    }
  };

  const guardar = () => {
    if (!titulo.trim() || !contenido.trim()) return;
    const nueva: Note = {
      id: Date.now(),
      asignatura,
      titulo: titulo.trim(),
      contenido: contenido.trim(),
      fecha: new Date().toLocaleString("es-ES"),
    };
    onSave(nueva);
    setTitulo("");
    setContenido("");
    setIsExpanded(false);
  };

  return (
    <>
      <div className="w-72 border-r border-slate-800 p-6 flex flex-col gap-4 overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Asignaturas
          </h2>
        </div>
        <div className="flex gap-2">
          <input
            value={nuevaAsigInput}
            onChange={(e) => setNuevaAsigInput(e.target.value)}
            placeholder="Nueva..."
            className="flex-1 bg-slate-900 border border-slate-800 p-1 text-xs rounded outline-none"
          />
          <button
            onClick={agregarAsignatura}
            className="p-1 bg-slate-800 rounded hover:text-cyan-400"
          >
            <Plus size={14} />
          </button>
        </div>
        <div className="flex flex-wrap gap-1">
          {misAsignaturas.map((a) => (
            <div key={a} className="group relative">
              <button
                onClick={() => setAsignatura(a)}
                className={`px-2 py-1 rounded text-[9px] font-bold border transition ${
                  asignatura === a
                    ? "bg-cyan-900/30 border-cyan-500 text-cyan-100"
                    : "bg-transparent border-slate-800 text-slate-500"
                }`}
              >
                {a}
              </button>
              {a !== "General" && (
                <button
                  onClick={() =>
                    setMisAsignaturas(misAsignaturas.filter((x) => x !== a))
                  }
                  className="absolute -top-1 -right-1 bg-red-600 rounded-full p-0.5 opacity-0 group-hover:opacity-100"
                >
                  <X size={8} />
                </button>
              )}
            </div>
          ))}
        </div>
        <input
          placeholder="Título..."
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="bg-slate-900 border border-slate-800 p-2 rounded text-sm outline-none"
        />
        <div className="relative group">
          {/* El contenedor 'group' sirve para efectos si quieres que el botón aparezca solo al pasar el mouse */}

          <textarea
            placeholder="Contenido..."
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            rows={5}
            className="w-full bg-slate-900 border border-slate-800 p-2 pr-8 rounded text-sm outline-none resize-none focus:border-cyan-900 transition"
          />

          <button
            onClick={() => setIsExpanded(true)}
            className="absolute top-2 right-2 text-slate-500 hover:text-cyan-400 p-1 bg-slate-900/50 rounded-md backdrop-blur-sm transition-colors"
            title="Expandir"
          >
            <Maximize2 size={14} />
          </button>
        </div>
        <button
          onClick={guardar}
          className="bg-cyan-600 py-3 rounded text-[10px] font-black tracking-[0.2em] hover:bg-cyan-500 transition"
        >
          GUARDAR REGISTRO
        </button>
      </div>

      {isExpanded && (
        <div className="fixed inset-0 z-[100] bg-[#02040a] p-10 flex flex-col animate-in zoom-in duration-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-cyan-400 font-black tracking-widest uppercase">
              Editor de Notas
            </h2>
            <button onClick={() => setIsExpanded(false)}>
              <Minimize2 size={30} />
            </button>
          </div>
          <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-xl outline-none custom-scroll"
          />
          <button
            onClick={guardar}
            className="mt-6 bg-cyan-600 py-4 rounded-xl font-bold uppercase tracking-widest"
          >
            Sincronizar
          </button>
        </div>
      )}
    </>
  );
};

export default NoteForm;

import { Note } from "../../Models/Note";
import { Trash2 } from "lucide-react";

interface NoteItemProps {
  nota: Note;
  selected: boolean;
  idsSeleccionados: number[];
  onToggleCheckbox: () => void;
  onSelect: () => void;
  onDelete: () => void;
}

export const NoteItem: React.FC<NoteItemProps> = ({
  nota,
  selected,
  idsSeleccionados,
  onToggleCheckbox,
  onSelect,
  onDelete,
}) => (
  <div
    onClick={onSelect}
    className={`p-4 rounded-xl border flex items-center gap-4 transition-all cursor-pointer ${
      selected
        ? "border-cyan-500 bg-slate-800/40"
        : "border-slate-800 bg-slate-900/20 hover:bg-slate-900/40"
    }`}
  >
    <input
      type="checkbox"
      checked={idsSeleccionados.includes(nota.id)}
      onChange={e => {
        e.stopPropagation();
        onToggleCheckbox();
      }}
      className="accent-cyan-500"
    />
    <div className="flex-1">
      <h4 className="text-sm font-bold text-slate-100">{nota.titulo}</h4>
      <p className="text-[9px] text-slate-500 uppercase">
        {nota.asignatura} | {nota.fecha}
      </p>
    </div>
    <button
      onClick={e => {
        e.stopPropagation();
        onDelete();
      }}
      className="text-slate-700 hover:text-red-500 transition-colors"
    >
      <Trash2 size={14} />
    </button>
  </div>
);

export default NoteItem;
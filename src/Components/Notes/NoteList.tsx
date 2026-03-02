import { Note } from "../../Models/Note";
import NoteItem from "../Notes/NoteItem";

interface NoteListProps {
  notas: Note[];
  notaSeleccionada: Note | null;
  onSelect: (note: Note) => void;
  idsSeleccionados: number[];
  setIdsSeleccionados: React.Dispatch<React.SetStateAction<number[]>>;
  onDelete: (id: number) => void;
}

export const NoteList: React.FC<NoteListProps> = ({
  notas,
  notaSeleccionada,
  onSelect,
  idsSeleccionados,
  setIdsSeleccionados,
  onDelete,
}) => (
  <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scroll">
    {notas.map(n => (
      <NoteItem
        key={n.id}
        nota={n}
        selected={notaSeleccionada?.id === n.id}
        idsSeleccionados={idsSeleccionados}
        onToggleCheckbox={() =>
          setIdsSeleccionados(prev =>
            prev.includes(n.id) ? prev.filter(x => x !== n.id) : [...prev, n.id]
          )
        }
        onSelect={() => onSelect(n)}
        onDelete={() => onDelete(n.id)}
      />
    ))}
  </div>
);

export default NoteList;
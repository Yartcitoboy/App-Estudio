import React from "react";
import NoteForm from "../Notes/NoteForm";
import { Note } from "../../Models/Note";
import Select, { StylesConfig } from "react-select";
import carreras from "../../Data/carreras.json";

interface CarreraOption {
  value: number;
  label: string;
}

interface SidebarProps {
  onSave: (note: Note) => void;
  carrera: string;
  onCarreraChange: (c: string) => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const customStyles: StylesConfig<CarreraOption, false> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#0f172a",
    borderColor: state.isFocused ? "#0891b2" : "#1e293b",
    boxShadow: "none",
    minHeight: "38px",
    "&:hover": {
      borderColor: "#0891b2"
    }
  }),

  menu: (base) => ({
    ...base,
    backgroundColor: "#0f172a",
    border: "1px solid #1e293b"
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "rgba(6, 182, 212, 0.25)"     // seleccionado
      : state.isFocused
      ? "rgba(6, 182, 212, 0.15)"     // hover
      : "transparent",
    color: "#cbd5e1",
    cursor: "pointer"
  }),

  singleValue: (base) => ({
    ...base,
    color: "#cbd5e1"
  }),

  input: (base) => ({
    ...base,
    color: "#cbd5e1"
  }),

  placeholder: (base) => ({
    ...base,
    color: "#64748b"
  }),

  dropdownIndicator: (base) => ({
    ...base,
    color: "#64748b",
    "&:hover": {
      color: "#06b6d4"
    }
  }),

  indicatorSeparator: () => ({
    display: "none"
  })
};

export const Sidebar: React.FC<SidebarProps> = ({
  onSave,
  carrera,
  onCarreraChange
}) => {

  const selectedOption =
    carreras.find((c: CarreraOption) => c.label === carrera) || null;

  return (
    <div className="flex flex-col w-72 border-r border-slate-800 bg-[#02040a]">
      <div className="px-4 pt-4 pb-3 border-b border-slate-800">
        <Select<CarreraOption, false>
          options={carreras}
          value={selectedOption}
          onChange={(option) =>
            onCarreraChange(option ? option.label : "")
          }
          placeholder="Selecciona tu carrera..."
          isSearchable
          styles={customStyles}
        />
      </div>

      <NoteForm onSave={onSave} />
    </div>
  );
};

export default Sidebar;
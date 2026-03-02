import React from "react";
import { Brain } from "lucide-react";

interface SystemOutputProps {
  cargando: boolean;
  texto?: string;
  nombrePersonaje?: string; // ✅ Añadimos esta prop
}

export const SystemOutput: React.FC<SystemOutputProps> = ({
  cargando,
  texto,
  nombrePersonaje,
}) => {
  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-cyan-900 animate-pulse">
        <Brain size={30} />
        <span className="text-[9px] font-black uppercase">Analizando...</span>
      </div>
    );
  }

  return (
    <div className="text-xs text-slate-400 leading-relaxed animate-in fade-in">
      <div className="text-[9px] text-cyan-600 font-black mb-4 border-b border-cyan-900/20 pb-2">
        SALIDA DEL SISTEMA
      </div>
      <p className="whitespace-pre-wrap">
        {texto || `Selecciona una nota para que ${nombrePersonaje || "el sistema"} la analice.`}
      </p>
    </div>
  );
};

export default SystemOutput;
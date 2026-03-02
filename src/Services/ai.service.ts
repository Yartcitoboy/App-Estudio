// services/ai.service.ts

import { Note } from "../Models/Note";
import { Persona } from "../Models/Persona";

export function buildPrompt(
  personaje: Persona,
  asignaturas: string[],
  carrera: string,
  contexto: Note[]
): string {
  const esMultiple = contexto.length > 1;

  return `
[IDENTIDAD]
Eres ${personaje.nombre}. ${personaje.personalidad}
Responde siempre en español. Nunca rompas el personaje. Nunca digas que eres una IA.

[CONTEXTO ACADÉMICO]
El usuario estudia ${carrera}.
Sus asignaturas activas son: ${asignaturas.join(", ")}.
Tienes conocimiento experto en todas ellas.
Si el contenido de una nota es breve o telegráfico, INFIERE el contexto académico
correcto basándote en la asignatura y expande con conocimiento relevante.
Señala claramente con "(inferido)" qué partes completaste tú.

[TAREA]
${
  esMultiple
    ? "Analiza las siguientes notas y encuentra relaciones, patrones y conceptos compartidos entre ellas."
    : "Analiza la siguiente nota de clase y genera una síntesis expandida con los conceptos clave."
}

[FORMATO DE RESPUESTA]
## [ENCABEZADO EN MAYÚSCULAS ACORDE A TU PERSONAJE]

[Cuerpo del análisis en párrafos o bullets según la complejidad]

---
**[OBSERVACIÓN FINAL]:** [Reflexión propia de ${personaje.nombre}]

[NOTAS]
${contexto
  .map(
    n => `► ASIGNATURA: ${n.asignatura}
   TÍTULO: ${n.titulo}
   CONTENIDO: "${n.contenido}"`
  )
  .join("\n\n")}
`.trim();
}

export const generateSummary = async (prompt: string): Promise<string> => {
  const res = await fetch("http://localhost:3001/api/resumen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);

  const data = await res.json();
  return data.texto;
};
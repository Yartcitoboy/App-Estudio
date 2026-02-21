import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.post("/api/resumen", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, // Asegúrate de que en tu .env se llame así
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // USAMOS LLAMA 3.3 de 70B (Es el reemplazo potente de Mixtral)
        "model": "llama-3.3-70b-versatile", 
        "messages": [
          {
            "role": "user",
            "content": prompt
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error de Groq:", data);
      return res.status(response.status).json({ 
        error: data.error?.message || "Error en la API de Groq" 
      });
    }

    // Estructura de respuesta de Groq (estilo OpenAI)
    const texto = data.choices[0]?.message?.content || "Sin respuesta.";
    res.json({ texto });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log("✅ Backend corriendo en http://localhost:3001");
});

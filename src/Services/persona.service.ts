import { Persona } from "../Models/Persona";
import personajes from "../Data/personajes.json";

export const fetchPersonajes = async (): Promise<Persona[]> => {
  return personajes as Persona[];
};
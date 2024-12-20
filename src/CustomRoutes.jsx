import { Routes, Route } from "react-router-dom";
import Pokedex from "./components/Pokedex/Pokedex";
import PokemonDetails from "./components/PokemonDetails/PokemonDetails";

export default function CustomRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Pokedex />} />
      <Route path="/pokemon/:id" element={<PokemonDetails />} />
    </Routes>
  );
}

import axios from "axios";
import { useEffect, useState } from "react";

function usePokemonDetails(id, pokemonName) {
  const [pokemon, setPokemon] = useState({
    name: "",
    image: "",
    weight: 0,
    height: 0,
    types: [],
    similarPokemons: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // Optional: Manage errors

  console.log(
    "usePokemonDetails called with id:",
    id,
    "and pokemonName:",
    pokemonName
  );

  async function downloadPokemon() {
    try {
      setIsLoading(true); // Start loading
      setError(null); // Reset errors

      // Determine API endpoint based on inputs
      const endpoint = pokemonName
        ? `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
        : `https://pokeapi.co/api/v2/pokemon/${id}`;

      console.log("Fetching data from:", endpoint);

      // Fetch Pokémon details
      const response = await axios.get(endpoint);

      const firstType = response.data.types[0]?.type.name || "";
      const similarResponse = firstType
        ? await axios.get(`https://pokeapi.co/api/v2/type/${firstType}`)
        : { data: { pokemon: [] } };

      // Update Pokémon state
      setPokemon({
        name: response.data.name,
        image:
          response.data.sprites.other.dream_world.front_default ||
          "default_image_url", // Fallback
        weight: response.data.weight,
        height: response.data.height,
        types: response.data.types.map((t) => t.type.name),
        similarPokemons: similarResponse.data.pokemon.slice(0, 5).map((p) => ({
          name: p.pokemon.name,
        })),
      });
    } catch (err) {
      console.error("Failed to fetch Pokémon details:", err);
      setError("Failed to fetch Pokémon details. Please try again.");
    } finally {
      setIsLoading(false); // End loading
    }
  }

  useEffect(() => {
    if (id || pokemonName) {
      downloadPokemon();
    }
  }, [id, pokemonName]);

  return { pokemon, isLoading, error };
}

export default usePokemonDetails;

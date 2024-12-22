import axios from "axios";
import { useEffect, useState } from "react";

function usePokemonDetails(id) {
  const [pokemon, setPokemon] = useState({
    name: "",
    image: "",
    weight: 0,
    height: 0,
    types: [],
    similarPokemons: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  async function downloadPokemon() {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${id}`
      );
      const firstType = response.data.types[0]?.type.name || "";
      const similarResponse = firstType
        ? await axios.get(`https://pokeapi.co/api/v2/type/${firstType}`)
        : { data: { pokemon: [] } };

      setPokemon({
        name: response.data.name,
        image: response.data.sprites.other.dream_world.front_default,
        weight: response.data.weight,
        height: response.data.height,
        types: response.data.types.map((t) => t.type.name),
        similarPokemons: similarResponse.data.pokemon.slice(0, 5).map((p) => ({
          name: p.pokemon.name,
        })),
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch Pokémon details:", error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      downloadPokemon();
    }
  }, [id]);

  return { pokemon, isLoading };
}

export default usePokemonDetails;

import axios from "axios";
import { useState ,useEffect} from "react";

export default function usePokemonList() {  
  const [pokemonListState, setPokemonListState] = useState({
    pokemonList: [],
    isLoading: true,
    nextUrl: null,
    prevUrl: null,
  });
  const [pokedexUrl, setPokedexUrl] = useState("https://pokeapi.co/api/v2/pokemon");
  async function downloadPokemons() {
    try {
      const response = await axios.get(pokedexUrl);
      const pokemonResultPromise = response.data.results.map((pokemon) =>
        axios.get(pokemon.url)
      );
      const pokemonData = await axios.all(pokemonResultPromise);
      const pokeListResult = pokemonData.map((pokeData) => {
        const pokemon = pokeData.data;
        return {
          id: pokemon.id,
          name: pokemon.name,
          image:
            pokemon.sprites.other?.dream_world?.front_default ||
            pokemon.sprites.front_shiny,
          types: pokemon.types,
        };
      });
      setPokemonListState({
        pokemonList: pokeListResult,
        isLoading: false,
        nextUrl: response.data.next,
        prevUrl: response.data.previous,
      });
    } catch (error) {
      console.error("Failed to fetch Pokémon data:", error);
      setPokemonListState((prevState) => ({ ...prevState, isLoading: false }));
    }
  }
  useEffect(() => {
    downloadPokemons();
  }, [pokedexUrl]);
  return { pokemonListState, setPokedexUrl };
}
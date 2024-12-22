import { useEffect, useState } from "react";
import axios from "axios";
import "./PokemonList.css";
import Pokemon from "../Pokemon/Pokemon";

function PokemonList() {
  const [pokedexUrl, setPokedexUrl] = useState(
    "https://pokeapi.co/api/v2/pokemon"
  );
  const [pokemonListState, setPokemonListState] = useState({
    pokemonList: [],
    isLoading: true,
    nextUrl: "",
    prevUrl: "",
  });

  async function downloadPokemons() {
    setPokemonListState((prevState) => ({ ...prevState, isLoading: true }));
    try {
      const response = await axios.get(pokedexUrl);
      const pokemonResults = response.data.results;

      const pokemonResultPromise = pokemonResults.map((pokemon) =>
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

  return (
    <div className="pokemon-list-wrapper">
      <div className="pokemon-wrapper">
        {pokemonListState.isLoading
          ? "Loading...."
          : pokemonListState.pokemonList.map((p) => (
              <Pokemon name={p.name} image={p.image} key={p.id} id={p.id} />
            ))}
      </div>
      <div className="controls">
        <button
          disabled={!pokemonListState.prevUrl}
          onClick={() => setPokedexUrl(pokemonListState.prevUrl)}
        >
          Prev
        </button>
        <button
          disabled={!pokemonListState.nextUrl}
          onClick={() => setPokedexUrl(pokemonListState.nextUrl)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PokemonList;

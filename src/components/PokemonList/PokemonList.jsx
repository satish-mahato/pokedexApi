import { useEffect, useState } from "react";
import axios from "axios";
import "./PokemonList.css";
import Pokemon from "../Pokemon/Pokemon";

function PokemonList() {
  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [pokedexUrl, setPokedexUrl] = useState(
    "https://pokeapi.co/api/v2/pokemon"
  );
  const [nextUrl, setNextUrl] = useState("");
  const [prevUrl, setPrevUrl] = useState("");

  async function downloadPokemons() {
    setIsLoading(true); // Set loading to true before fetching data
    try {
      const response = await axios.get(pokedexUrl); // Fetch the list of 20 pokemons
      const pokemonResults = response.data.results; // Get the array of Pokémon results

      // Prepare an array of promises to fetch individual Pokémon details
      const pokemonResultPromise = pokemonResults.map((pokemon) =>
        axios.get(pokemon.url)
      );

      // Fetch all Pokémon details in parallel
      const pokemonData = await axios.all(pokemonResultPromise);

      // Update next and previous URLs
      setNextUrl(response.data.next);
      setPrevUrl(response.data.previous);

      // Process the Pokémon data to extract required fields
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

      setPokemonList(pokeListResult); // Update the Pokémon list
    } catch (error) {
      console.error("Failed to fetch Pokémon data:", error);
    } finally {
      setIsLoading(false); // Set loading to false after fetching
    }
  }

  useEffect(() => {
    downloadPokemons(); // Fetch Pokémon data whenever pokedexUrl changes
  }, [pokedexUrl]);

  return (
    <div className="pokemon-list-wrapper">
      <div className="pokemon-wrapper">
        {isLoading
          ? "Loading...."
          : pokemonList.map((p) => (
              <Pokemon name={p.name} image={p.image} key={p.id} id={p.id} />
            ))}
      </div>
      <div className="controls">
        <button disabled={!prevUrl} onClick={() => setPokedexUrl(prevUrl)}>
          Prev
        </button>
        <button disabled={!nextUrl} onClick={() => setPokedexUrl(nextUrl)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default PokemonList;

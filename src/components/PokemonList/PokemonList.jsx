import "./PokemonList.css";
import Pokemon from "../Pokemon/Pokemon";
import usePokemonList from "../../hooks/usePokemonList";

function PokemonList() {
  const { pokemonListState, setPokedexUrl } = usePokemonList();

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

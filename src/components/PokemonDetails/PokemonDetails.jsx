import { useParams } from "react-router-dom";
import "./PokemonDetails.css";
import usePokemonDetails from "../../hooks/usePokemonDetails";

function PokemonDetails({pokemonName}) {
  const { id } = useParams();
  const { pokemon, isLoading } = usePokemonDetails(id, pokemonName);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!pokemon) {
    return <div>Error: Pokémon data could not be loaded.</div>;
  }

  return (
    <div className="pokemon-details-wrapper">
      <img
        className="pokemon-details-image"
        src={pokemon.image}
        alt={pokemon.name}
      />
      <div className="pokemon-details-name">
        <span>{pokemon.name}</span>
      </div>
      <div className="pokemon-details-name">Height: {pokemon.height}</div>
      <div className="pokemon-details-name">Weight: {pokemon.weight}</div>
      <div className="pokemon-details-types">
        {pokemon.types && pokemon.types.map((t) => <div key={t}> {t} </div>)}
      </div>

      {pokemon.types && pokemon.similarPokemons && (
        <div>
          <p>More {pokemon.types[0]} type Pokémon:</p>
          <ul>
            {pokemon.similarPokemons.map((p) => (
              <li key={p.name}>{p.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PokemonDetails;

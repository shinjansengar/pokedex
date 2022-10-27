import { useEffect, useState } from "react";
import "./App.css";
import Modal from "react-modal/lib/components/Modal";


Modal.setAppElement('#root');

const App = () => {
  const [pokemons, setPokemons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#ffe0c4',
    },
  };

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/?limit=15&offset=${(currentPage - 1) * 15}`)
      .then(res => res.json())
      .then(data => {
        setPokemons(() => {
          return data.results;
        })
        setTotalCount(() => {
          return data.count;
        })
      });
  }, [currentPage]);

  useEffect(() => {
    if (selectedPokemon) {
      setIsLoading(true);
      fetch(selectedPokemon.url)
        .then(res => res.json())
        .then(data => {
          setPokemonDetails(data)
          setIsLoading(false);
        })
        .catch(err => setIsLoading(false));
    }
  }, [selectedPokemon]);

  const handlePagination = (moveToIndex) => {
    if (moveToIndex !== currentPage && moveToIndex >= 1 && (moveToIndex - 1) * 15 < totalCount) {
      setCurrentPage(moveToIndex);
    }
  };

  const handlePokemonPopup = (pokemon) => {
    setIsOpen(true);
    setSelectedPokemon(pokemon);
  }

  const closeModal = () => {
    setIsOpen(false);
  }

  return (
    <div className="pokemon-wrapper">
      <div>
        <h1 className="pokemon-title">Pokedex</h1>
        <h3 >Choose your pokemon</h3>
      </div>
      <div className="pokemon-list">
        {pokemons.map((pokemon, index) => {
          return (
            <div key={pokemon.name} className="pokemon-card" onClick={() => handlePokemonPopup(pokemon)}>
              <h3>{pokemon.name.toLocaleUpperCase()}</h3>
              <img src={`https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/other/official-artwork/${(currentPage - 1) * 15 + index + 1}.png?raw=true`} alt={pokemon.name} />
            </div>
          )
        })}
      </div>
      <div className="pokemon-pagination">
        <span onClick={() => handlePagination(currentPage - 1)}>&laquo;</span>
        <span className="pokemon-currentpage">{currentPage}</span>
        <span onClick={() => handlePagination(currentPage + 1)}>{currentPage + 1}</span>
        <span onClick={() => handlePagination(currentPage + 2)}>{currentPage + 2}</span>
        <span onClick={() => handlePagination(currentPage + 3)}>{currentPage + 3}</span>
        <span onClick={() => handlePagination(currentPage + 4)}>{currentPage + 4}</span>
        <span onClick={() => handlePagination(currentPage + 5)}>{currentPage + 5}</span>
        <span onClick={() => handlePagination(currentPage + 1)}>&raquo;</span>
      </div>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        {isLoading ? <h1>Loading...</h1>
          :
          <div className='pokemon-details-wrapper'>
            <h2>{pokemonDetails.name.toLocaleUpperCase()}</h2>
            <img src={pokemonDetails.sprites.front_default} />
            <div className='pokemon-info-wrapper'>
              <div>
                <p>Abilities</p>
                <ul className='pokemon-abilities'>
                  {pokemonDetails.abilities.map(item => {
                    return (
                      <li key={item.ability.name}>
                        {item.ability.name}
                      </li>
                    )
                  })}
                </ul>
              </div>
              <div className='pokemon-stats'>
                <p>Stats</p>
                {pokemonDetails.stats.map(item => {
                  return (
                    <div key={item.stat.name}>
                      {item.stat.name + ': ' + item.base_stat}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        }
      </Modal>
    </div>
  );
}

export default App;

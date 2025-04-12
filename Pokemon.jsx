import './index.css';
import { useState, useEffect } from 'react';
import { PokemonCards } from './PokemonCards.jsx';
import { Pagination } from './Pagination.jsx';

export const Pokemon = () => {
  const [Pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);

  // This is the API URL
  // const API = `https://pokeapi.co/api/v2/pokemon?limit=400&offset=0`;

  // This function is used to fetch the data from the API
  const fetchPokemon = async () => {
    try {
      const limit = 100;
      const totalPokemon = 660; // total number of pokemon
      const request = [];

      //create requestes for chunks of pokemon
      for (let offset = 0; offset < totalPokemon; offset += limit) {
        const API = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
        request.push(
          fetch(API).then(
            (response) => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            }
          )
        );
      }

      //fetch all requests
      const responses = await Promise.all(request);
      const allPokemon = [];

      //flatten the array of arrays
      responses.forEach((response) => {
        allPokemon.push(...response.results);
      });

      //fetch all pokemon data
      const pokemonData = allPokemon.map(async (curpokemon) => {
        try {
          const response = await fetch(curpokemon.url);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.log(error);
        }
      });
      // console.log(pokemonData);

      //   const response = await fetch(API);
      //   const data = await response.json();
      //   //setPokemon(data.results);
      //   //console.log(data.results);

      //   // This is used to fetch the data from the API
      //   const pokemonData = data.results.map(async (curpokemon) => {
      //     try {
      //       const response = await fetch(curpokemon.url);
      //       const data = await response.json();
      //       ///console.log(data);
      //       return data;
      //     } catch (error) {
      //       console.log(error);
      //     }
      //   });
      // console.log(pokemonData);

      // The Promise.all() method takes an iterable of Promise objects and,
      // when all of the promises have resolved, returns a single Promise
      // that resolves to an array of the results.
      const pokemonDataResolved = await Promise.all(pokemonData);
      console.log(pokemonDataResolved);
      setPokemon(pokemonDataResolved);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(error);
      setLoading(false);
    }
  };

  
  // This function is called when the component mounts
  // and when the component updates
  // It is used to fetch the data from the API
  useEffect(() => {
    fetchPokemon();
  }, []);

  
  // This function is used to display the loading message
  if (loading) {
    return (
      <div className='loading'>
        <h1>Loading...</h1>
      </div>
    );
  }

  
  // This function is used to display the error message
  if (error) {
    return (
      <div className='error'>
        <h1>Error: {error.message}</h1>
      </div>
    );
  }

  
  // This function is used to handle the search input
  const searchData = Pokemon.filter((curpokemon) => {
    return curpokemon.name.toLowerCase().includes(search.toLowerCase());
  });

  
  // This function is used to handle the pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(searchData.length / itemsPerPage);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };


  // This function is used to display the data
  return (
    <>
      <section className='container'>
        <header>
          <h1>Pokemons</h1>
        </header>
        <div className='pokemon-search'>
          <input
            type='text'
            placeholder='Search Pokemon'
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div>
          <ul className='cards'>
            {/* {Pokemon.map((curpokemon) => { */}
            {currentItems.map((curpokemon) => {
              return (
                <PokemonCards key={curpokemon.id} pokemonData={curpokemon} />
              );
            })}
          </ul>
        </div>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          paginate={paginate}
        />
      </section>
    </>
  );
};

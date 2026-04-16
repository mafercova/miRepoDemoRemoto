import React, { useState, useEffect } from 'react';
import PokeCard from './PokeCard';

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerPokemons = async () => {
      try {
        const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
        const data = await respuesta.json();

        const promesas = data.results.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          const detalles = await res.json();
          
          return {
            id: detalles.id,
            name: detalles.name,
            type: detalles.types[0].type.name, 
            hp: detalles.stats.find(stat => stat.stat.name === 'hp').base_stat, 
            image: detalles.sprites.other['official-artwork'].front_default || detalles.sprites.front_default
          };
        });

        const resultados = await Promise.all(promesas);
        
        setPokemons(resultados);
        setCargando(false);

      } catch (error) {
        console.error("Hubo un error al obtener los Pokémon:", error);
        setCargando(false);
      }
    };

    obtenerPokemons();
  }, []);

  return (
    <div className="app-container">
      <h1 style={{ 
        textAlign: 'center', 
        color: '#ffcb05', 
        textShadow: '2px 2px #3b4cca',
        marginBottom: '30px',
        fontSize: '3rem'
      }}>
        Carta Pokémon
      </h1>

      {}
      {cargando ? (
        <h2 style={{ textAlign: 'center', color: '#fff' }}>Cargando Pokémon... </h2>
      ) : (
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center',
          gap: '20px' 
        }}>
          {pokemons.map((pokemon) => (
            <PokeCard 
              key={pokemon.id}
              id={pokemon.id}
              name={pokemon.name}
              type={pokemon.type}
              hp={pokemon.hp}
              image={pokemon.image}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
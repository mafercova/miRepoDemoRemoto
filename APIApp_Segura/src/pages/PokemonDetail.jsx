import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function PokemonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pokemon, setPokemon] = useState(null)

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(res => res.json())
      .then(setPokemon)
  }, [id])

  if (!pokemon) return <div className="loading">Cargando...</div>

  return (
    <div className="pokemon-detail">
      <button onClick={() => navigate(-1)} className="btn-back">← Volver</button>
      <div className="detail-card">
        <img
          src={pokemon.sprites.other['official-artwork'].front_default}
          alt={pokemon.name}
        />
        <h1>{pokemon.name.toUpperCase()}</h1>
        <p className="pokemon-id">#{String(pokemon.id).padStart(3, '0')}</p>
        <div className="types">
          {pokemon.types.map(t => (
            <span key={t.type.name} className={`type ${t.type.name}`}>
              {t.type.name}
            </span>
          ))}
        </div>
        <div className="stats">
          <h2>Estadísticas base</h2>
          {pokemon.stats.map(s => (
            <div key={s.stat.name} className="stat-row">
              <span className="stat-name">{s.stat.name}</span>
              <div className="stat-bar-bg">
                <div
                  className="stat-bar-fill"
                  style={{ width: `${(s.base_stat / 255) * 100}%` }}
                />
              </div>
              <span className="stat-value">{s.base_stat}</span>
            </div>
          ))}
        </div>
        <div className="info">
          <p><strong>Altura:</strong> {pokemon.height / 10} m</p>
          <p><strong>Peso:</strong> {pokemon.weight / 10} kg</p>
        </div>
      </div>
    </div>
  )
}

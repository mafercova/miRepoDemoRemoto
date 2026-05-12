import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
]

export default function Filtrar() {
  const [pokemon, setPokemon] = useState([])
  const [details, setDetails] = useState({})
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
      .then(res => res.json())
      .then(async data => {
        setPokemon(data.results)
        const allDetails = await Promise.all(
          data.results.map(p => fetch(p.url).then(res => res.json()))
        )
        const detailMap = {}
        allDetails.forEach(d => { detailMap[d.name] = d })
        setDetails(detailMap)
      })
  }, [])

  const filtered = pokemon.filter(p => {
    const matchesName = p.name.toLowerCase().includes(search.toLowerCase())
    if (!selectedType) return matchesName
    const pDetails = details[p.name]
    if (!pDetails) return matchesName
    return matchesName && pDetails.types.some(t => t.type.name === selectedType)
  })

  return (
    <div className="filtrar-page">
      <h1>Filtrar Pokémon</h1>
      <div className="filter-controls">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          className="type-select"
        >
          <option value="">Todos los tipos</option>
          {POKEMON_TYPES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="pokemon-grid">
        {filtered.map(p => {
          const id = p.url.split('/').filter(Boolean).pop()
          return (
            <div
              key={p.name}
              className="pokemon-card"
              onClick={() => navigate(`/detalles/${id}`)}
            >
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                alt={p.name}
              />
              <p className="pokemon-id">#{id.padStart(3, '0')}</p>
              <p className="pokemon-name">{p.name}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

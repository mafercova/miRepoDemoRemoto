import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const FEATURED_IDS = [25, 6, 150, 143, 94, 149]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all(
      FEATURED_IDS.map(id =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json())
      )
    ).then(setFeatured)
  }, [])

  return (
    <div className="home">
      <div className="home-hero">
        <h1>Bienvenido a PokéApp</h1>
        <p>Explora el mundo Pokémon, busca tus favoritos y descubre sus estadísticas.</p>
      </div>
      <section className="featured-section">
        <h2>Pokémon Destacados</h2>
        <div className="pokemon-grid">
          {featured.map(p => (
            <div
              key={p.id}
              className="pokemon-card"
              onClick={() => navigate(`/detalles/${p.id}`)}
            >
              <img
                src={p.sprites.other['official-artwork'].front_default}
                alt={p.name}
              />
              <p className="pokemon-id">#{String(p.id).padStart(3, '0')}</p>
              <p className="pokemon-name">{p.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

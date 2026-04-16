import React from 'react';
import './PokeCard.css';

const bgColors = {
  fire: '#FFE4CB', grass: '#D3F4D6', electric: '#FFF3B0', water: '#D4E8F9',
  ground: '#F2D7B6', rock: '#E0E0E0', fairy: '#FDE1F5', poison: '#E2C3EA',
  bug: '#E1F0C4', dragon: '#C9D6F0', psychic: '#FBCBE3', normal: '#F5F5F5'
};

const borderColors = {
  fire: '#C45D35', grass: '#5B8B66', electric: '#B89B24', water: '#4A7CA6',
  ground: '#9E7C52', rock: '#888888', fairy: '#C982B3', poison: '#8A6096',
  bug: '#7B914A', dragon: '#5A75A6', psychic: '#BA6594', normal: '#999999'
};

const typeEmojis = {
  fire: '🔥', grass: '🌿', water: '💧', electric: '⚡', normal: '⭐',
  bug: '🐛', poison: '☠️', flying: '🦅', fairy: '✨', fighting: '🥊'
};

const PokeCard = ({ id, name, type, image, hp }) => {
  const bgColor = bgColors[type] || '#F5F5F5';
  const accentColor = borderColors[type] || '#999999';
  const emoji = typeEmojis[type] || '🔹';

  return (
    <div className="pokemon-card" style={{ backgroundColor: bgColor }}>
      {}
      <div className="inner-border" style={{ borderColor: accentColor }}>
        
        <div className="card-header">
          <h3 className="name">{name} <span className="heart">❤️</span></h3>
          <span className="hp">HP {hp}</span>
        </div>
        
        <div className="image-container">
          <div className="shield-bg"></div>
          <img src={image} alt={name} />
        </div>

        <div className="card-info">
          <span className="type-badge" style={{ backgroundColor: accentColor }}>
            {emoji} {type}
          </span>
          
          {}
          <div className="stats-container">
            <div className="stat-row">
              <span className="stat-icon">❤️</span>
              <div className="stat-bar"><div className="stat-fill" style={{width: '75%', backgroundColor: accentColor}}></div></div>
            </div>
            <div className="stat-row">
              <span className="stat-icon">🗡️</span>
              <div className="stat-bar"><div className="stat-fill" style={{width: '60%', backgroundColor: accentColor}}></div></div>
            </div>
          </div>
        </div>
        
        <div className="card-footer">
          <span className="id">
             <span style={{fontSize: '1.2em'}}>🔴</span> #{id.toString().padStart(3, '0')}
          </span>
        </div>

      </div>
    </div>
  );
};

export default PokeCard;
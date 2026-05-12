<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  types: {
    type: Array,
    default: () => []
  },
  number: {
    type: [String, Number],
    default: ''
  }
})

const typeColors = {
  grass: '#78C850',
  poison: '#A040A0',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  psychic: '#F85888',
  flying: '#A890F0',
  bug: '#A8B820',
  normal: '#A8A878',
  ground: '#E0C068',
  rock: '#B8A038',
  dragon: '#7038F8',
  steel: '#B8B8D0',
  ice: '#98D8D8',
  ghost: '#705898',
  fighting: '#C03028'
}
</script>

<template>
  <div class="card">
    <div class="card-header">
      <span class="pokemon-number">#{{ number }}</span>
    </div>
    <div class="image-container">
      <img :src="image" :alt="name" class="pokemon-image" />
    </div>
    <h3 class="pokemon-name">{{ name }}</h3>
    <div class="pokemon-types">
      <span 
        v-for="type in types" 
        :key="type" 
        class="type-badge"
        :style="{ backgroundColor: typeColors[type] || '#aaa' }"
      >
        {{ type }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255,255,255,0.1);
  text-align: center;
  max-width: 220px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(233, 69, 96, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.card:hover {
  transform: translateY(-15px) scale(1.03);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.card:hover::before {
  opacity: 1;
}

.card-header {
  display: flex;
  justify-content: flex-end;
  position: relative;
  z-index: 1;
}

.pokemon-number {
  font-size: 0.85rem;
  font-weight: 700;
  color: #666;
  background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
}

.image-container {
  background: linear-gradient(180deg, #f8f9fa, #e9ecef);
  border-radius: 50%;
  width: 150px;
  height: 150px;
  margin: 0.5rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  box-shadow: inset 0 2px 10px rgba(0,0,0,0.05);
}

.pokemon-image {
  width: 120px;
  height: 120px;
  object-fit: contain;
  image-rendering: pixelated;
  transition: transform 0.3s;
}

.card:hover .pokemon-image {
  transform: scale(1.1);
}

.pokemon-name {
  text-transform: capitalize;
  margin: 1rem 0;
  font-size: 1.4rem;
  font-weight: 800;
  color: #1a1a2e;
  position: relative;
  z-index: 1;
}

.pokemon-types {
  display: flex;
  gap: 0.6rem;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.type-badge {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  color: white;
  text-transform: capitalize;
  text-shadow: 0 1px 3px rgba(0,0,0,0.2);
  box-shadow: 0 3px 10px rgba(0,0,0,0.15);
}
</style>
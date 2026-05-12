<script setup>
import { ref, computed } from 'vue'
import ContactForm from './components/ContactForm.vue'
import PokemonCard from './components/PokemonCard.vue'

const count = ref(0)

const pokemonList = [
  {
    name: 'bulbasaur',
    number: '001',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    types: ['grass', 'poison']
  },
  {
    name: 'charmander',
    number: '004',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
    types: ['fire']
  },
  {
    name: 'squirtle',
    number: '007',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
    types: ['water']
  }
]

const isEven = computed(() => count.value % 2 === 0)
</script>

<template>
  <div class="app">
    <header class="header">
      <h1 class="title">Mi App Vue</h1>
      <p class="subtitle">Bienvenido a la demostración de Vue.js</p>
    </header>

    <div class="layout">
      <main class="main-content">
        <div class="grid-container">
          <div class="card counter-card">
            <h2 class="card-title">Contador</h2>
            <div class="counter">
              <span class="count" :class="{ even: isEven }">{{ count }}</span>
              <div class="buttons">
                <button class="btn btn-decrement" @click="count--">−</button>
                <button class="btn btn-increment" @click="count++">+</button>
              </div>
            </div>
          </div>

          <div class="card">
            <ContactForm />
          </div>
        </div>

        <div class="card pokemon-card">
          <h2 class="card-title">Pokémon</h2>
          <div class="pokemon-list">
            <PokemonCard
              v-for="pokemon in pokemonList"
              :key="pokemon.number"
              :name="pokemon.name"
              :image="pokemon.image"
              :types="pokemon.types"
              :number="pokemon.number"
            />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.app {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  box-sizing: border-box;
}

.header {
  background: linear-gradient(135deg, #e94560 0%, #0f3460 100%);
  padding: 3rem 2rem;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.3;
}

.title {
  font-size: 3rem;
  margin: 0;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  position: relative;
  z-index: 1;
  text-shadow: 3px 3px 6px rgba(0,0,0,0.3);
}

.subtitle {
  margin: 0.5rem 0 0;
  font-size: 1.1rem;
  opacity: 0.9;
  position: relative;
  z-index: 1;
}

.layout {
  display: block;
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.card {
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}

.card-title {
  font-size: 1.4rem;
  color: #1a1a2e;
  margin-bottom: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 24px;
  background: linear-gradient(180deg, #e94560, #0f3460);
  border-radius: 2px;
}

.counter-card {
  text-align: center;
}

.counter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.count {
  font-size: 5rem;
  font-weight: 800;
  color: #1a1a2e;
  transition: color 0.3s, transform 0.3s;
  line-height: 1;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.count.even {
  color: #42b883;
  text-shadow: 0 0 20px rgba(66, 184, 131, 0.4);
}

.count:hover {
  transform: scale(1.05);
}

.buttons {
  display: flex;
  gap: 1.5rem;
}

.btn {
  width: 70px;
  height: 70px;
  font-size: 2.5rem;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

.btn:hover {
  transform: scale(1.15) translateY(-3px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.3);
}

.btn:active {
  transform: scale(0.95);
}

.btn-decrement {
  background: linear-gradient(135deg, #ff6b6b, #c0392b);
  color: white;
}

.btn-increment {
  background: linear-gradient(135deg, #42b883, #27ae60);
  color: white;
}

.pokemon-card {
  background: linear-gradient(145deg, #ffffff, #f0f4f8);
}

.pokemon-card .card-title::before {
  background: linear-gradient(180deg, #f1c40f, #e67e22);
}

.pokemon-list {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  .count {
    font-size: 3.5rem;
  }
  .btn {
    width: 55px;
    height: 55px;
    font-size: 2rem;
  }
  .grid-container {
    grid-template-columns: 1fr;
  }
}
</style>

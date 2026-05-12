<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const submitted = ref(false)

function handleSubmit() {
  submitted.value = true
}
</script>

<template>
  <div class="form-container card">
    <h2 class="form-title">Formulario de Contacto</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Nombre</label>
        <input 
          id="name" 
          v-model="name" 
          type="text" 
          placeholder="Ingresa tu nombre"
          required 
        />
      </div>

      <div class="form-group">
        <label for="email">Correo electrónico</label>
        <input 
          id="email" 
          v-model="email" 
          type="email" 
          placeholder="correo@ejemplo.com"
          required 
        />
      </div>

      <button type="submit" class="btn-submit">Enviar</button>
    </form>

    <div v-if="submitted && name && email" class="result">
      <h3>Datos capturados</h3>
      <p><span class="label">Nombre:</span> {{ name }}</p>
      <p><span class="label">Correo:</span> {{ email }}</p>
    </div>
  </div>
</template>

<style scoped>
.form-container {
  width: 100%;
}

.form-title {
  font-size: 1.4rem;
  color: #1a1a2e;
  margin-bottom: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 24px;
  background: linear-gradient(180deg, #e94560, #0f3460);
  border-radius: 2px;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

input {
  width: 100%;
  padding: 1rem 1.2rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  transition: all 0.3s;
  box-sizing: border-box;
  background: #fafafa;
}

input:focus {
  outline: none;
  border-color: #e94560;
  background: white;
  box-shadow: 0 0 0 4px rgba(233, 69, 96, 0.1);
}

input::placeholder {
  color: #aaa;
}

.btn-submit {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #e94560, #c73e54);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-submit:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(233, 69, 96, 0.4);
}

.btn-submit:active {
  transform: translateY(0);
}

.result {
  margin-top: 1.5rem;
  padding: 1.2rem;
  background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
  border-radius: 12px;
  border-left: 4px solid #42b883;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.result h3 {
  margin: 0 0 0.8rem;
  color: #2e7d32;
  font-weight: 700;
}

.result p {
  margin: 0.4rem 0;
  color: #37474f;
  font-size: 1rem;
}

.result .label {
  font-weight: 700;
  color: #1a1a2e;
}
</style>
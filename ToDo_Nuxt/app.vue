<script setup>
const tareas = ref([])
const nuevaTarea = ref('')
const editandoId = ref(null)
const editandoTexto = ref('')
const filtro = ref('todas')

const total = computed(() => tareas.value.length)
const completadas = computed(() => tareas.value.filter(t => t.completada).length)
const porcentaje = computed(() => total.value > 0 ? Math.round(completadas.value / total.value * 100) : 0)

const filtradas = computed(() => {
  if (filtro.value === 'favoritas') return tareas.value.filter(t => t.favorita)
  if (filtro.value === 'completadas') return tareas.value.filter(t => t.completada)
  if (filtro.value === 'pendientes') return tareas.value.filter(t => !t.completada)
  return tareas.value
})

async function cargar() {
  tareas.value = await $fetch('/api/tareas')
}

async function agregar() {
  if (!nuevaTarea.value.trim()) return
  const tarea = await $fetch('/api/tareas', { method: 'POST', body: { titulo: nuevaTarea.value } })
  tareas.value.push(tarea)
  nuevaTarea.value = ''
}

async function eliminar(id) {
  await $fetch(`/api/tareas/${id}`, { method: 'DELETE' })
  tareas.value = tareas.value.filter(t => t.id !== id)
}

async function toggleFav(id) {
  const t = await $fetch(`/api/tareas/${id}`, { method: 'PATCH', params: { campo: 'favorita' } })
  const i = tareas.value.findIndex(x => x.id === id)
  if (i !== -1) tareas.value[i] = t
}

async function toggleComp(id) {
  const t = await $fetch(`/api/tareas/${id}`, { method: 'PATCH', params: { campo: 'completada' } })
  const i = tareas.value.findIndex(x => x.id === id)
  if (i !== -1) tareas.value[i] = t
}

function editar(t) {
  editandoId.value = t.id
  editandoTexto.value = t.titulo
}

async function guardar(id) {
  if (!editandoTexto.value.trim()) return
  const t = await $fetch(`/api/tareas/${id}`, { method: 'PUT', body: { titulo: editandoTexto.value } })
  const i = tareas.value.findIndex(x => x.id === id)
  if (i !== -1) tareas.value[i] = t
  editandoId.value = null
  editandoTexto.value = ''
}

function cancelar() {
  editandoId.value = null
  editandoTexto.value = ''
}

onMounted(cargar)
</script>

<template>
  <div class="app">
    <div class="card">
      <header class="hd">
        <div class="hd-top">
          <h1>Mis Tareas</h1>
          <span class="badge">{{ completadas }}/{{ total }}</span>
        </div>
        <div class="bar"><div class="fill" :style="{ width: porcentaje + '%' }"></div></div>
      </header>

      <div class="input-row">
        <input v-model="nuevaTarea" @keyup.enter="agregar" placeholder="Nueva tarea..." />
        <button @click="agregar" class="add">+</button>
      </div>

      <div class="filtros">
        <button v-for="f in [{k:'todas',l:'Todas'},{k:'pendientes',l:'Pendientes'},{k:'completadas',l:'Completadas'},{k:'favoritas',l:'Favoritas'}]" :key="f.k" :class="['fil',{act:filtro===f.k}]" @click="filtro=f.k">{{ f.l }}</button>
      </div>

      <ul class="lista">
        <li v-for="t in filtradas" :key="t.id" :class="{hecha:t.completada,fav:t.favorita}">
          <template v-if="editandoId===t.id">
            <input v-model="editandoTexto" @keyup.enter="guardar(t.id)" class="inp-ed" />
            <div class="ed-btns">
              <button @click="guardar(t.id)" class="ok">&#10003;</button>
              <button @click="cancelar" class="no">&#10005;</button>
            </div>
          </template>
          <template v-else>
            <div class="info" @click="toggleComp(t.id)">
              <div :class="['chk',{on:t.completada}]"><span v-if="t.completada">&#10003;</span></div>
              <span class="tit">{{ t.titulo }}</span>
            </div>
            <div class="btns">
              <button @click.stop="editar(t)" class="btn ed" title="Editar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button @click.stop="toggleFav(t.id)" :class="['btn','st',{on:t.favorita}]" title="Favorita">
                <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </button>
              <button @click.stop="eliminar(t.id)" class="btn dl" title="Eliminar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </template>
        </li>
      </ul>

      <div v-if="filtradas.length===0" class="vacio">
        <p>No hay tareas</p>
      </div>
    </div>
  </div>
</template>

<style>
* { margin:0; padding:0; box-sizing:border-box }
body { font-family:system-ui,sans-serif; background:linear-gradient(135deg,#667eea,#764ba2); min-height:100vh; padding:20px }
.app { display:flex; justify-content:center; padding-top:40px }
.card { width:100%; max-width:520px; background:#fff; border-radius:24px; box-shadow:0 25px 50px -12px rgba(0,0,0,.25); overflow:hidden }
.hd { padding:24px; background:linear-gradient(135deg,#667eea,#764ba2); color:#fff }
.hd-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px }
.hd h1 { font-size:24px }
.badge { background:rgba(255,255,255,.2); padding:4px 12px; border-radius:20px; font-size:14px }
.bar { height:8px; background:rgba(255,255,255,.3); border-radius:4px; overflow:hidden }
.fill { height:100%; background:#fff; border-radius:4px; transition:width .5s }
.input-row { display:flex; gap:12px; padding:20px 24px; background:#f8fafc }
.input-row input { flex:1; padding:14px 18px; border:2px solid #e2e8f0; border-radius:14px; font-size:15px; outline:none }
.input-row input:focus { border-color:#667eea; box-shadow:0 0 0 4px rgba(102,126,234,.1) }
.add { width:52px; height:52px; border:none; border-radius:14px; background:linear-gradient(135deg,#667eea,#764ba2); color:#fff; font-size:28px; cursor:pointer; transition:all .3s }
.add:hover { transform:scale(1.05); box-shadow:0 8px 20px rgba(102,126,234,.4) }
.filtros { display:flex; gap:8px; padding:0 24px 16px; flex-wrap:wrap }
.fil { padding:8px 14px; border:none; border-radius:20px; background:#f1f5f9; color:#64748b; font-size:13px; font-weight:600; cursor:pointer; transition:all .3s }
.fil:hover { background:#e2e8f0 }
.fil.act { background:linear-gradient(135deg,#667eea,#764ba2); color:#fff }
.lista { list-style:none; padding:0 16px 24px }
.lista li { display:flex; justify-content:space-between; align-items:center; padding:14px 16px; margin-bottom:10px; background:#f8fafc; border-radius:14px; transition:all .3s }
.lista li:hover { background:#f1f5f9; transform:translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,.05) }
.lista li.hecha .tit { text-decoration:line-through; color:#94a3b8 }
.lista li.fav { border-left:4px solid #fbbf24 }
.info { display:flex; align-items:center; gap:14px; flex:1; cursor:pointer }
.chk { width:24px; height:24px; border:2px solid #cbd5e1; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .3s }
.chk.on { background:linear-gradient(135deg,#667eea,#764ba2); border-color:#667eea; color:#fff }
.tit { font-size:15px; color:#334155; font-weight:500 }
.btns { display:flex; gap:6px; opacity:0; transition:opacity .3s }
.lista li:hover .btns { opacity:1 }
.btn { width:32px; height:32px; border:none; border-radius:8px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .3s }
.btn svg { width:16px; height:16px }
.ed { background:#e0f2fe; color:#0284c7 }
.ed:hover { background:#0284c7; color:#fff }
.st { background:#fef3c7; color:#d97706 }
.st.on { background:#fbbf24; color:#fff }
.st:hover { background:#f59e0b; color:#fff }
.dl { background:#fee2e2; color:#dc2626 }
.dl:hover { background:#dc2626; color:#fff }
.inp-ed { flex:1; padding:10px 14px; border:2px solid #667eea; border-radius:10px; font-size:14px; outline:none }
.ed-btns { display:flex; gap:6px }
.ok,.no { width:32px; height:32px; border:none; border-radius:8px; cursor:pointer; font-weight:bold }
.ok { background:#22c55e; color:#fff }
.no { background:#ef4444; color:#fff }
.vacio { text-align:center; padding:40px; color:#94a3b8 }
.vacio p { font-size:18px; font-weight:600; color:#64748b }
</style>
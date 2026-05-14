const state = { grupoActivo: null, grupos: [], fecha: hoy() }

function hoy() { return new Date().toISOString().split('T')[0] }

// ---- GRUPOS ----
async function cargarGrupos() {
  state.grupos = await api.grupos.listar()
  const ul = document.getElementById('grupos-list')
  ul.innerHTML = state.grupos.map(g => `
    <li data-id="${g.id}" class="${state.grupoActivo === g.id ? 'activo' : ''}">
      <span>${g.nombre}</span>
      <button class="del" data-id="${g.id}" title="Eliminar">&times;</button>
    </li>
  `).join('')

  ul.querySelectorAll('li span').forEach(el => {
    el.addEventListener('click', () => seleccionarGrupo(el.closest('li').dataset.id))
  })
  ul.querySelectorAll('.del').forEach(btn => {
    btn.addEventListener('click', async e => {
      e.stopPropagation()
      if (confirm('¿Eliminar grupo?')) {
        await api.grupos.eliminar(parseInt(btn.dataset.id))
        if (state.grupoActivo === parseInt(btn.dataset.id)) {
          state.grupoActivo = null
          document.getElementById('vista-grupo').style.display = 'none'
          document.getElementById('seleccionar-grupo').style.display = 'flex'
        }
        cargarGrupos()
      }
    })
  })
}

async function seleccionarGrupo(id) {
  state.grupoActivo = parseInt(id)
  state.fecha = document.getElementById('fecha-asistencia').value || hoy()
  document.getElementById('seleccionar-grupo').style.display = 'none'
  document.getElementById('vista-grupo').style.display = 'block'

  const grupo = state.grupos.find(g => g.id === state.grupoActivo)
  document.getElementById('grupo-titulo').textContent = grupo.nombre
  cargarGrupos()
  cargarAsistencia()
  cargarDashboard()
}

// ---- MODAL ----
function mostrarModal(titulo, html, onOk) {
  document.getElementById('modal-title').textContent = titulo
  document.getElementById('modal-body').innerHTML = html
  document.getElementById('modal-overlay').style.display = 'flex'

  const ok = document.getElementById('modal-ok')
  const cancel = document.getElementById('modal-cancel')
  const newOk = ok.cloneNode(true)
  ok.replaceWith(newOk)
  const newCancel = cancel.cloneNode(true)
  cancel.replaceWith(newCancel)

  newCancel.addEventListener('click', cerrarModal)
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target.id === 'modal-overlay') cerrarModal()
  })
  newOk.addEventListener('click', () => { onOk(); cerrarModal() })

  const inp = document.querySelector('#modal-body input')
  if (inp) { inp.focus(); inp.addEventListener('keydown', e => { if (e.key === 'Enter') { onOk(); cerrarModal() } }) }
}

function cerrarModal() { document.getElementById('modal-overlay').style.display = 'none' }

// ---- GRUPOS CRUD ----
document.getElementById('btn-nuevo-grupo').addEventListener('click', () => {
  mostrarModal('Nuevo Grupo', '<input id="inp-grupo" placeholder="Nombre del grupo" />', async () => {
    const v = document.getElementById('inp-grupo').value.trim()
    if (!v) return
    await api.grupos.crear(v)
    await cargarGrupos()
  })
})

document.getElementById('btn-editar-grupo').addEventListener('click', () => {
  const grupo = state.grupos.find(g => g.id === state.grupoActivo)
  mostrarModal('Editar Grupo', `<input id="inp-grupo" value="${grupo.nombre}" />`, async () => {
    const v = document.getElementById('inp-grupo').value.trim()
    if (!v) return
    await api.grupos.actualizar(grupo.id, v)
    await cargarGrupos()
    document.getElementById('grupo-titulo').textContent = v
  })
})

document.getElementById('btn-eliminar-grupo').addEventListener('click', async () => {
  if (!confirm('¿Eliminar este grupo y todos sus datos?')) return
  await api.grupos.eliminar(state.grupoActivo)
  state.grupoActivo = null
  document.getElementById('vista-grupo').style.display = 'none'
  document.getElementById('seleccionar-grupo').style.display = 'flex'
  cargarGrupos()
})

// ---- TABS ----
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'))
    document.querySelectorAll('.tab-content').forEach(tc => tc.style.display = 'none')
    tab.classList.add('active')
    document.getElementById(`tab-${tab.dataset.tab}`).style.display = 'block'
  })
})

// ---- ASISTENCIA ----
document.getElementById('fecha-asistencia').value = hoy()
document.getElementById('fecha-asistencia').addEventListener('change', e => {
  state.fecha = e.target.value
  cargarAsistencia()
})

async function cargarAsistencia() {
  if (!state.grupoActivo) return
  const alumnos = await api.asistencias.listar(state.grupoActivo, state.fecha)
  const tbody = document.getElementById('asistencia-body')
  tbody.innerHTML = alumnos.map((a, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${a.nombre}</td>
      <td><button class="toggle ${a.presente ? 'on' : ''}" data-id="${a.id}"></button></td>
      <td>
        <button class="btn-icon edit" data-id="${a.id}" data-nombre="${a.nombre}">Editar</button>
        <button class="btn-icon del" data-id="${a.id}">Eliminar</button>
      </td>
    </tr>
  `).join('')

  tbody.querySelectorAll('.toggle').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.dataset.id)
      const nuevoEstado = !btn.classList.contains('on')
      btn.classList.toggle('on', nuevoEstado)
      await api.asistencias.marcar(id, state.fecha, nuevoEstado)
    })
  })

  tbody.querySelectorAll('.edit').forEach(btn => {
    btn.addEventListener('click', () => {
      mostrarModal('Editar Alumno', `<input id="inp-alumno" value="${btn.dataset.nombre}" />`, async () => {
        const v = document.getElementById('inp-alumno').value.trim()
        if (!v) return
        await api.alumnos.actualizar(parseInt(btn.dataset.id), v)
        cargarAsistencia()
        cargarDashboard()
      })
    })
  })

  tbody.querySelectorAll('.del').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('¿Eliminar alumno?')) return
      await api.alumnos.eliminar(parseInt(btn.dataset.id))
      cargarAsistencia()
      cargarDashboard()
    })
  })
}

document.getElementById('btn-nuevo-alumno').addEventListener('click', () => {
  mostrarModal('Nuevo Alumno', '<input id="inp-alumno" placeholder="Nombre del alumno" />', async () => {
    const v = document.getElementById('inp-alumno').value.trim()
    if (!v) return
    await api.alumnos.crear(state.grupoActivo, v)
    cargarAsistencia()
    cargarDashboard()
  })
})

// ---- DASHBOARD ----
async function cargarDashboard() {
  if (!state.grupoActivo) return
  const data = await api.asistencias.dashboard(state.grupoActivo)
  const total = data.totalAlumnos
  const conDatos = data.alumnos.filter(a => a.total_clases > 0)
  const presentes = conDatos.reduce((s, a) => s + parseInt(a.presentes), 0)
  const totalClases = conDatos.reduce((s, a) => s + parseInt(a.total_clases), 0)
  const prom = totalClases > 0 ? Math.round(presentes / totalClases * 100) : 0

  // Cards
  document.getElementById('dashboard-resumen').innerHTML = `
    <div class="stat-card blue"><h4>Total Alumnos</h4><div class="num">${total}</div></div>
    <div class="stat-card green"><h4>Promedio Asistencia</h4><div class="num">${prom}%</div></div>
    <div class="stat-card amber"><h4>Clases Registradas</h4><div class="num">${data.fechas.length}</div></div>
    <div class="stat-card red"><h4>Alumnos < 70%</h4><div class="num">${data.alumnos.filter(a => a.porcentaje !== null && parseFloat(a.porcentaje) < 70).length}</div></div>
  `

  const tbody = document.getElementById('dashboard-body')
  tbody.innerHTML = data.alumnos.map(a => {
    const pct = a.porcentaje !== null ? parseFloat(a.porcentaje) : 0
    const ausencias = parseInt(a.total_clases) - parseInt(a.presentes || 0)
    const color = pct >= 70 ? 'verde' : pct >= 40 ? 'ambar' : 'roja'
    return `<tr>
      <td>${a.nombre}</td>
      <td>${a.total_clases || 0}</td>
      <td>${a.presentes || 0}</td>
      <td>${ausencias}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="barra-fondo" style="flex:1"><div class="barra-llena ${color}" style="width:${pct}%"></div></div>
          <span style="font-weight:600;min-width:40px">${pct}%</span>
        </div>
      </td>
    </tr>`
  }).join('')
}

// ---- INIT ----
cargarGrupos()

import { tareas } from '../../utils/tareas'

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id)
  const tarea = tareas.find(t => t.id === id)

  if (!tarea) {
    throw createError({ statusCode: 404, statusMessage: 'Tarea no encontrada' })
  }

  if (event.method === 'DELETE') {
    const idx = tareas.indexOf(tarea)
    tareas.splice(idx, 1)
    return { success: true }
  }

  if (event.method === 'PUT') {
    const body = await readBody(event)
    tarea.titulo = body.titulo
    return tarea
  }

  if (event.method === 'PATCH') {
    const query = getQuery(event)
    if (query.campo === 'favorita') tarea.favorita = !tarea.favorita
    if (query.campo === 'completada') tarea.completada = !tarea.completada
    return tarea
  }
})
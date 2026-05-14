import { tareas, getNextId } from '../../utils/tareas'

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    return tareas
  }

  if (event.method === 'POST') {
    const body = await readBody(event)
    const nueva = { id: getNextId(), titulo: body.titulo, completada: false, favorita: false }
    tareas.push(nueva)
    return nueva
  }
})
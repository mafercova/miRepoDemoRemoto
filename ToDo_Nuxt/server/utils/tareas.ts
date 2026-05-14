export const tareas = [
  { id: 1, titulo: 'Aprender Nuxt', completada: false, favorita: false },
  { id: 2, titulo: 'Hacer ejercicio', completada: true, favorita: false },
  { id: 3, titulo: 'Leer un libro', completada: false, favorita: true }
]

const estado = { nextId: 4 }

export function getNextId() {
  return estado.nextId++
}
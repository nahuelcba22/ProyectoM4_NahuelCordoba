import { useEffect, useState, type FormEvent } from 'react'
import {
addDoc,
collection,
deleteDoc,
doc,
onSnapshot,
query,
updateDoc,
where,
} from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { db } from '../services/firebase'

interface Task {
id: string
title: string
completed: boolean
userId: string
createdAt: {
seconds: number
nanoseconds: number
}
}

function Tasks() {
const { user, logout } = useAuth()

const [title, setTitle] = useState('')
const [tasks, setTasks] = useState<Task[]>([])
const [message, setMessage] = useState('')
const [loading, setLoading] = useState(false)
const [emailLoading, setEmailLoading] = useState(false)

const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
const [editingTitle, setEditingTitle] = useState('')

const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null)
const [processingTaskId, setProcessingTaskId] = useState<string | null>(
null,
)

useEffect(() => {
if (!user) {
setTasks([])
return
}

const tasksQuery = query(
  collection(db, 'tasks'),
  where('userId', '==', user.uid),
)

const unsubscribe = onSnapshot(
  tasksQuery,
  (snapshot) => {
    const tasksData = snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Task[]

    setTasks(tasksData)
  },
  () => {
    setMessage('No se pudieron cargar las tareas.')
  },
)

return unsubscribe

}, [user])

useEffect(() => {
if (!message) {
return
}

const timeout = setTimeout(() => {
  setMessage('')
}, 3000)

return () => clearTimeout(timeout)


}, [message])

const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
event.preventDefault()


if (!user) {
  setMessage('Tenés que iniciar sesión para crear una tarea.')
  return
}

if (!title.trim()) {
  setMessage('Ingresá un título para la tarea.')
  return
}

try {
  setLoading(true)
  setMessage('')

  await addDoc(collection(db, 'tasks'), {
    title: title.trim(),
    completed: false,
    userId: user.uid,
    createdAt: new Date(),
  })

  setTitle('')
  setMessage('Tarea creada correctamente.')
} catch {
  setMessage('No se pudo crear la tarea.')
} finally {
  setLoading(false)
}


}

const handleSendEmail = async () => {
if (!user) {
setMessage('Tenés que iniciar sesión para enviar el resumen.')
return
}

if (tasks.length === 0) {
  setMessage('No tenés tareas para enviar.')
  return
}

try {
  setEmailLoading(true)
  setMessage('')

  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: user.email,
      tasks,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'No se pudo enviar el email.')
  }

  setMessage('Resumen enviado correctamente a tu email.')
} catch (error) {
  console.error('Error al enviar el resumen:', error)
  setMessage('No se pudo enviar el resumen por email.')
} finally {
  setEmailLoading(false)
}

}

const handleToggleCompleted = async (
taskId: string,
completed: boolean,
) => {
if (processingTaskId) {
return
}

try {
  setProcessingTaskId(taskId)
  setMessage('')

  await updateDoc(doc(db, 'tasks', taskId), {
    completed: !completed,
  })

  setMessage(
    completed
      ? 'Tarea marcada como pendiente.'
      : 'Tarea completada correctamente.',
  )
} catch {
  setMessage('No se pudo actualizar la tarea.')
} finally {
  setProcessingTaskId(null)
}

}

const handleStartEditing = (task: Task) => {
setEditingTaskId(task.id)
setEditingTitle(task.title)
setDeletingTaskId(null)
setMessage('')
}

const handleCancelEditing = () => {
setEditingTaskId(null)
setEditingTitle('')
}

const handleSaveEdit = async (taskId: string) => {
if (!editingTitle.trim()) {
setMessage('El título no puede estar vacío.')
return
}

try {
  setProcessingTaskId(taskId)
  setMessage('')

  await updateDoc(doc(db, 'tasks', taskId), {
    title: editingTitle.trim(),
  })

  setEditingTaskId(null)
  setEditingTitle('')
  setMessage('Tarea editada correctamente.')
} catch {
  setMessage('No se pudo editar la tarea.')
} finally {
  setProcessingTaskId(null)
}

}

const handleStartDeleting = (taskId: string) => {
setDeletingTaskId(taskId)
setEditingTaskId(null)
setMessage('')
}

const handleCancelDeleting = () => {
setDeletingTaskId(null)
}

const handleDelete = async (taskId: string) => {
try {
setProcessingTaskId(taskId)
setMessage('')

  await deleteDoc(doc(db, 'tasks', taskId))

  setDeletingTaskId(null)
  setMessage('Tarea eliminada correctamente.')
} catch {
  setMessage('No se pudo eliminar la tarea.')
} finally {
  setProcessingTaskId(null)
}


}

return ( <main className="tasks-page"> <section className="tasks-container"> <header className="tasks-header"> <div> <h1>Mis tareas</h1> <p>Organizá y gestioná tus tareas.</p> </div>

      <button
        type="button"
        className="logout-button"
        onClick={logout}
      >
        Cerrar sesión
      </button>
    </header>

    <section className="task-create-card">
      <h2>Nueva tarea</h2>

      <form className="task-create-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="¿Qué necesitás hacer?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Agregar tarea'}
        </button>
      </form>
    </section>

    <section className="task-email-card">
      <h2>Resumen de tareas</h2>

      <p>
        Recibí un resumen de tus tareas actuales en tu correo electrónico.
      </p>

      <button
        type="button"
        onClick={handleSendEmail}
        disabled={emailLoading || tasks.length === 0}
      >
        {emailLoading
          ? 'Enviando resumen...'
          : 'Enviar resumen por email'}
      </button>
    </section>

    {message && <p className="task-message">{message}</p>}

    <section className="task-list-section">
      <div className="task-list-header">
        <h2>Mis tareas</h2>
        <span>{tasks.length}</span>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-tasks">
          <p>No tenés tareas todavía.</p>
          <span>Creá tu primera tarea para comenzar.</span>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <article
              className={`task-card ${
                task.completed ? 'task-completed' : ''
              }`}
              key={task.id}
            >
              {editingTaskId === task.id ? (
                <div className="task-edit">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(event) =>
                      setEditingTitle(event.target.value)
                    }
                    disabled={processingTaskId === task.id}
                    autoFocus
                  />

                  <div className="task-actions">
                    <button
                      type="button"
                      className="save-button"
                      onClick={() => handleSaveEdit(task.id)}
                      disabled={processingTaskId === task.id}
                    >
                      {processingTaskId === task.id
                        ? 'Guardando...'
                        : 'Guardar'}
                    </button>

                    <button
                      type="button"
                      className="cancel-button"
                      onClick={handleCancelEditing}
                      disabled={processingTaskId === task.id}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : deletingTaskId === task.id ? (
                <div className="task-delete-confirmation">
                  <span>¿Eliminar esta tarea?</span>

                  <div className="task-actions">
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={handleCancelDeleting}
                      disabled={processingTaskId === task.id}
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDelete(task.id)}
                      disabled={processingTaskId === task.id}
                    >
                      {processingTaskId === task.id
                        ? 'Eliminando...'
                        : 'Eliminar'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="task-content">
                    <span className="task-title">
                      {task.title}
                    </span>
                  </div>

                  <div className="task-actions">
                    <button
                      type="button"
                      className="complete-button"
                      onClick={() =>
                        handleToggleCompleted(
                          task.id,
                          task.completed,
                        )
                      }
                      disabled={processingTaskId !== null}
                    >
                      {processingTaskId === task.id
                        ? 'Guardando...'
                        : task.completed
                          ? 'Pendiente'
                          : 'Completar'}
                    </button>

                    <button
                      type="button"
                      className="edit-button"
                      onClick={() => handleStartEditing(task)}
                      disabled={processingTaskId !== null}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleStartDeleting(task.id)}
                      disabled={processingTaskId !== null}
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  </section>
</main>


)
}

export default Tasks

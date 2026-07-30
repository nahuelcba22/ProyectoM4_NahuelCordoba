import { useEffect, useState } from 'react'
import {
  createTask,
  deleteTask,
  subscribeToUserTasks,
  toggleTaskCompleted,
  updateTask,
} from '../services/taskService'
import type { Task } from '../types/task'

export function useTasks(userId: string | undefined) {
  const [prevUserId, setPrevUserId] = useState(userId)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [processingTaskId, setProcessingTaskId] = useState<string | null>(
    null,
  )
  const [message, setMessage] = useState('')

  if (userId !== prevUserId) {
    setPrevUserId(userId)
    setTasks([])
    setProcessingTaskId(null)
  }

  useEffect(() => {
    if (!userId) {
      return
    }

    return subscribeToUserTasks(
      userId,
      (tasks) => {
        setTasks(tasks)
      },
      () => {
        setMessage('No se pudieron cargar las tareas.')
      },
    )
  }, [userId])

  const addTask = async (title: string, description: string = '') => {
    if (!userId) {
      setMessage('Tenés que iniciar sesión para crear una tarea.')
      return false
    }

    if (!title.trim()) {
      setMessage('Ingresá un título para la tarea.')
      return false
    }

    try {
      setLoading(true)
      setMessage('')

      await createTask(title, description, userId)

      setMessage('Tarea creada correctamente.')
      return true
    } catch {
      setMessage('No se pudo crear la tarea.')
      return false
    } finally {
      setLoading(false)
    }
  }

  const toggleTask = async (
    taskId: string,
    completed: boolean,
  ) => {
    if (processingTaskId) {
      return false
    }

    try {
      setProcessingTaskId(taskId)
      setMessage('')

      await toggleTaskCompleted(taskId, completed)

      setMessage(
        completed
          ? 'Tarea marcada como pendiente.'
          : 'Tarea completada correctamente.',
      )

      return true
    } catch {
      setMessage('No se pudo actualizar la tarea.')
      return false
    } finally {
      setProcessingTaskId(null)
    }
  }

  const editTask = async (
    taskId: string,
    title: string,
    description: string = '',
  ) => {
    if (!title.trim()) {
      setMessage('El título no puede estar vacío.')
      return false
    }

    if (processingTaskId) {
      return false
    }

    try {
      setProcessingTaskId(taskId)
      setMessage('')

      await updateTask(taskId, title, description)

      setMessage('Tarea editada correctamente.')
      return true
    } catch {
      setMessage('No se pudo editar la tarea.')
      return false
    } finally {
      setProcessingTaskId(null)
    }
  }

  const removeTask = async (taskId: string) => {
    if (processingTaskId) {
      return false
    }

    try {
      setProcessingTaskId(taskId)
      setMessage('')

      await deleteTask(taskId)

      setMessage('Tarea eliminada correctamente.')
      return true
    } catch {
      setMessage('No se pudo eliminar la tarea.')
      return false
    } finally {
      setProcessingTaskId(null)
    }
  }

  return {
    tasks,
    loading,
    processingTaskId,
    message,
    setMessage,
    addTask,
    toggleTask,
    editTask,
    removeTask,
  }
}


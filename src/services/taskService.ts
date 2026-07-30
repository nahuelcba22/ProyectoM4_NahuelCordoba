import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Task } from '../types/task'

function getTaskTime(task: Task): number {
  const createdAt = task.createdAt
  if (!createdAt) return 0
  if (typeof (createdAt as { toMillis?: () => number }).toMillis === 'function') {
    return (createdAt as { toMillis: () => number }).toMillis()
  }
  if (typeof createdAt.seconds === 'number') {
    return createdAt.seconds * 1000 + (createdAt.nanoseconds || 0) / 1000000
  }
  return 0
}

export function subscribeToUserTasks(
  userId: string,
  onTasksChange: (tasks: Task[]) => void,
  onError: () => void,
): Unsubscribe {
  const tasksQuery = query(
    collection(db, 'tasks'),
    where('userId', '==', userId),
  )

  return onSnapshot(
    tasksQuery,
    (snapshot) => {
      const tasks = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as Task[]

      tasks.sort((a, b) => getTaskTime(b) - getTaskTime(a))

      onTasksChange(tasks)
    },
    onError,
  )
}

export async function createTask(
  title: string,
  userId: string,
): Promise<void> {
  await addDoc(collection(db, 'tasks'), {
    title: title.trim(),
    completed: false,
    userId,
    createdAt: new Date(),
  })
}

export async function toggleTaskCompleted(
  taskId: string,
  completed: boolean,
): Promise<void> {
  await updateDoc(doc(db, 'tasks', taskId), {
    completed: !completed,
  })
}

export async function updateTask(
  taskId: string,
  title: string,
): Promise<void> {
  await updateDoc(doc(db, 'tasks', taskId), {
    title: title.trim(),
  })
}

export async function deleteTask(
  taskId: string,
): Promise<void> {
  await deleteDoc(doc(db, 'tasks', taskId))
}
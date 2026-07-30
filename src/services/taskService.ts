import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Task } from '../types/task'

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
import type { Timestamp } from 'firebase/firestore'

export interface Task {
  id: string
  title: string
  completed: boolean
  userId: string
  createdAt?: Timestamp | {
    seconds: number
    nanoseconds: number
  }
}
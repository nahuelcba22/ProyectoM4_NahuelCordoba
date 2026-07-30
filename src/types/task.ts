export interface Task {
  id: string
  title: string
  completed: boolean
  userId: string
  createdAt: {
    seconds: number
    nanoseconds: number
  }
}
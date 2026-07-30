import { useState } from 'react'
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from 'vitest'
import { render, screen, cleanup, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Tasks from './Tasks'
import { useAuth } from '../context/useAuth'
import { useTasks } from '../hooks/useTasks'
import type { User } from 'firebase/auth'
import type { Task } from '../types/task'

vi.mock('../context/useAuth', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../hooks/useTasks', () => ({
  useTasks: vi.fn(),
}))

const mockUseAuth = vi.mocked(useAuth)
const mockUseTasks = vi.mocked(useTasks)

describe('Tasks Page Component', () => {
  const mockLogout = vi.fn()
  const mockAddTask = vi.fn()
  const mockToggleTask = vi.fn()
  const mockEditTask = vi.fn()
  const mockRemoveTask = vi.fn()
  const mockSetMessage = vi.fn()

  const defaultUser = {
    uid: '12345',
    email: 'user@example.com',
  }

  const sampleTasks: Task[] = [
    {
      id: 'task-1',
      title: 'Tarea pendiente',
      completed: false,
      userId: '12345',
      createdAt: { seconds: 1000, nanoseconds: 0 },
    },
    {
      id: 'task-2',
      title: 'Tarea completada',
      completed: true,
      userId: '12345',
      createdAt: { seconds: 2000, nanoseconds: 0 },
    },
  ]

  let currentTasks: Task[] = []

  beforeEach(() => {
    vi.clearAllMocks()
    currentTasks = []

    mockUseAuth.mockReturnValue({
      user: defaultUser as unknown as User,
      logout: mockLogout,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
    })

    mockUseTasks.mockImplementation(() => {
      const [message, setMessageState] = useState('')
      return {
        tasks: currentTasks,
        loading: false,
        processingTaskId: null,
        message,
        setMessage: (msg: string | ((prev: string) => string)) => {
          const nextValue = typeof msg === 'function' ? msg(message) : msg
          setMessageState(nextValue)
          mockSetMessage(nextValue)
        },
        addTask: mockAddTask,
        toggleTask: mockToggleTask,
        editTask: mockEditTask,
        removeTask: mockRemoveTask,
      }
    })
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('1. Estado vacío: muestra mensaje de sin tareas y deshabilita botón de enviar email', () => {
    currentTasks = []

    render(<Tasks />)

    expect(
      screen.getByText('No tenés tareas todavía.')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Creá tu primera tarea para comenzar.')
    ).toBeInTheDocument()

    const listHeader = screen.getByText('Mis tareas', {
      selector: 'h2',
    }).parentElement!
    expect(within(listHeader).getByText('0')).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: 'Enviar resumen por email',
      })
    ).toBeDisabled()
  })

  it('2. Renderizado de tareas: muestra tareas pendientes, completadas y aplica clase CSS correspondiente', () => {
    currentTasks = sampleTasks

    render(<Tasks />)

    expect(screen.getByText('Tarea pendiente')).toBeInTheDocument()
    expect(screen.getByText('Tarea completada')).toBeInTheDocument()

    const listHeader = screen.getByText('Mis tareas', {
      selector: 'h2',
    }).parentElement!
    expect(within(listHeader).getByText('2')).toBeInTheDocument()

    const completedCard = screen
      .getByText('Tarea completada')
      .closest('article')
    expect(completedCard).toHaveClass('task-completed')

    const pendingCard = screen
      .getByText('Tarea pendiente')
      .closest('article')
    expect(pendingCard).not.toHaveClass('task-completed')
  })

  it('3. Crear una tarea: llama a addTask con el título escrito', async () => {
    currentTasks = []
    mockAddTask.mockResolvedValue(true)
    const user = userEvent.setup()

    render(<Tasks />)

    const input = screen.getByPlaceholderText('¿Qué necesitás hacer?')
    await user.type(input, 'Nueva tarea')

    await user.click(
      screen.getByRole('button', { name: 'Agregar tarea' })
    )

    expect(mockAddTask).toHaveBeenCalledTimes(1)
    expect(mockAddTask).toHaveBeenCalledWith('Nueva tarea')
  })

  it('4. Completar una tarea: llama a toggleTask con el ID y completed = false', async () => {
    currentTasks = [sampleTasks[0]] // Tarea pendiente
    const user = userEvent.setup()

    render(<Tasks />)

    await user.click(
      screen.getByRole('button', { name: 'Completar' })
    )

    expect(mockToggleTask).toHaveBeenCalledTimes(1)
    expect(mockToggleTask).toHaveBeenCalledWith('task-1', false)
  })

  it('5. Marcar una tarea completada como pendiente: llama a toggleTask con el ID y completed = true', async () => {
    currentTasks = [sampleTasks[1]] // Tarea completada
    const user = userEvent.setup()

    render(<Tasks />)

    await user.click(
      screen.getByRole('button', { name: 'Pendiente' })
    )

    expect(mockToggleTask).toHaveBeenCalledTimes(1)
    expect(mockToggleTask).toHaveBeenCalledWith('task-2', true)
  })

  it('6. Editar una tarea: abre input de edición y llama a editTask con el ID y el nuevo título', async () => {
    currentTasks = [
      {
        id: 'task-1',
        title: 'Título original',
        completed: false,
        userId: '12345',
        createdAt: { seconds: 1000, nanoseconds: 0 },
      },
    ]

    mockEditTask.mockResolvedValue(true)
    const user = userEvent.setup()

    render(<Tasks />)

    await user.click(screen.getByRole('button', { name: 'Editar' }))

    const editInput = screen.getByDisplayValue('Título original')
    expect(editInput).toBeInTheDocument()

    await user.clear(editInput)
    await user.type(editInput, 'Título actualizado')

    await user.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(mockEditTask).toHaveBeenCalledTimes(1)
    expect(mockEditTask).toHaveBeenCalledWith(
      'task-1',
      'Título actualizado'
    )
  })

  it('7. Eliminar una tarea con confirmación: confirma la eliminación y cancela correctamente', async () => {
    currentTasks = [sampleTasks[0]]
    mockRemoveTask.mockResolvedValue(true)
    const user = userEvent.setup()

    render(<Tasks />)

    // A: Probar cancelación
    await user.click(
      screen.getByRole('button', { name: 'Eliminar' })
    )

    expect(
      screen.getByText('¿Eliminar esta tarea?')
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Cancelar' })
    )

    expect(
      screen.queryByText('¿Eliminar esta tarea?')
    ).not.toBeInTheDocument()
    expect(mockRemoveTask).not.toHaveBeenCalled()

    // B: Probar confirmación de eliminación
    await user.click(
      screen.getByRole('button', { name: 'Eliminar' })
    )

    const confirmationContainer = screen
      .getByText('¿Eliminar esta tarea?')
      .closest('div')!
    const confirmDeleteButton = within(
      confirmationContainer
    ).getByRole('button', { name: 'Eliminar' })

    await user.click(confirmDeleteButton)

    expect(mockRemoveTask).toHaveBeenCalledTimes(1)
    expect(mockRemoveTask).toHaveBeenCalledWith('task-1')
  })

  it('8. Envío exitoso del resumen por email: llama a fetch con los datos correctos y muestra mensaje de éxito', async () => {
    currentTasks = [sampleTasks[0]]

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        message: 'Email enviado correctamente.',
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const user = userEvent.setup()

    render(<Tasks />)

    await user.click(
      screen.getByRole('button', {
        name: 'Enviar resumen por email',
      })
    )

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/send-email',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'user@example.com',
          tasks: [sampleTasks[0]],
        }),
      })
    )

    expect(
      await screen.findByText(
        'Resumen enviado correctamente a tu email.'
      )
    ).toBeInTheDocument()
    expect(mockSetMessage).toHaveBeenCalledWith(
      'Resumen enviado correctamente a tu email.'
    )
  })

  it('9. Error del serverless al enviar el email: muestra mensaje de error al fallar el fetch', async () => {
    currentTasks = [sampleTasks[0]]

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        message: 'No se pudo procesar la solicitud.',
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const user = userEvent.setup()

    render(<Tasks />)

    await user.click(
      screen.getByRole('button', {
        name: 'Enviar resumen por email',
      })
    )

    expect(
      await screen.findByText(
        'No se pudo enviar el resumen por email.'
      )
    ).toBeInTheDocument()
    expect(mockSetMessage).toHaveBeenCalledWith(
      'No se pudo enviar el resumen por email.'
    )
  })
})

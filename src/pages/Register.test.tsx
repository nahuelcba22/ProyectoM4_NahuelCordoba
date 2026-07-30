import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Register from './Register'
import { useAuth } from '../context/useAuth'

vi.mock('../context/useAuth', () => ({
  useAuth: vi.fn(),
}))

const mockUseAuth = vi.mocked(useAuth)

describe('Register Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('1. Renderizado inicial: muestra el título, campos de email/contraseña, botón e hipervínculo a /login', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    })

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', {
        name: 'Crear una cuenta',
      })
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText('Correo electrónico')
    ).toBeInTheDocument()

    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'Crear cuenta' })
    ).toBeInTheDocument()

    const loginLink = screen.getByRole('link', {
      name: 'Iniciar sesión',
    })
    expect(loginLink).toBeInTheDocument()
    expect(loginLink).toHaveAttribute('href', '/login')
  })

  it('2. Validación de campos vacíos: muestra mensaje de error y no llama a register', async () => {
    const mockRegister = vi.fn()
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
    })

    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )

    await user.click(
      screen.getByRole('button', { name: 'Crear cuenta' })
    )

    expect(
      screen.getByText('Completá todos los campos.')
    ).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('3. Registro exitoso: llama a register con los datos ingresados y navega a /tareas', async () => {
    const mockRegister = vi.fn().mockResolvedValue(undefined)
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
    })

    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/registro']}>
        <Routes>
          <Route path="/registro" element={<Register />} />
          <Route
            path="/tareas"
            element={<div>Página de tareas</div>}
          />
        </Routes>
      </MemoryRouter>
    )

    await user.type(
      screen.getByLabelText('Correo electrónico'),
      'user@example.com'
    )
    await user.type(
      screen.getByLabelText('Contraseña'),
      'password123'
    )
    await user.click(
      screen.getByRole('button', { name: 'Crear cuenta' })
    )

    expect(mockRegister).toHaveBeenCalledTimes(1)
    expect(mockRegister).toHaveBeenCalledWith(
      'user@example.com',
      'password123'
    )
    expect(
      await screen.findByText('Página de tareas')
    ).toBeInTheDocument()
  })

  it('4. Error durante el registro: muestra mensaje de error y no navega a /tareas', async () => {
    const mockRegister = vi
      .fn()
      .mockRejectedValue(new Error('Error de registro'))

    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
    })

    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/registro']}>
        <Routes>
          <Route path="/registro" element={<Register />} />
          <Route
            path="/tareas"
            element={<div>Página de tareas</div>}
          />
        </Routes>
      </MemoryRouter>
    )

    await user.type(
      screen.getByLabelText('Correo electrónico'),
      'user@example.com'
    )
    await user.type(
      screen.getByLabelText('Contraseña'),
      'password123'
    )
    await user.click(
      screen.getByRole('button', { name: 'Crear cuenta' })
    )

    expect(
      await screen.findByText(
        'No se pudo crear la cuenta. Verificá los datos e intentá nuevamente.'
      )
    ).toBeInTheDocument()
    expect(
      screen.queryByText('Página de tareas')
    ).not.toBeInTheDocument()
  })

  it('5. Estado de carga: deshabilita inputs y muestra "Creando cuenta..." mientras el registro está pendiente', async () => {
    const mockRegister = vi
      .fn()
      .mockReturnValue(new Promise(() => {}))
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
    })

    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )

    const emailInput = screen.getByLabelText('Correo electrónico')
    const passwordInput = screen.getByLabelText('Contraseña')

    await user.type(emailInput, 'user@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(
      screen.getByRole('button', { name: 'Crear cuenta' })
    )

    const submitButton = screen.getByRole('button', {
      name: 'Creando cuenta...',
    })

    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
    expect(emailInput).toBeDisabled()
    expect(passwordInput).toBeDisabled()
  })
})

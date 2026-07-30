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
import Login from './Login'
import { useAuth } from '../context/useAuth'

vi.mock('../context/useAuth', () => ({
  useAuth: vi.fn(),
}))

const mockUseAuth = vi.mocked(useAuth)

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('1. Renderizado inicial: muestra el título, campos de email/contraseña, botón e hipervínculo de registro', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    })

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', {
        name: 'Gestor Estratégico de Tareas',
      })
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText('Correo electrónico')
    ).toBeInTheDocument()

    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'Iniciar sesión' })
    ).toBeInTheDocument()

    const registerLink = screen.getByRole('link', {
      name: /crear una cuenta/i,
    })
    expect(registerLink).toBeInTheDocument()
    expect(registerLink).toHaveAttribute('href', '/registro')
  })

  it('2. Validación de campos vacíos: muestra mensaje de error y no llama a login', async () => {
    const mockLogin = vi.fn()
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
    })

    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    await user.click(
      screen.getByRole('button', { name: 'Iniciar sesión' })
    )

    expect(
      screen.getByText('Completá todos los campos.')
    ).toBeInTheDocument()
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('3. Login exitoso: llama a login con los datos ingresados y navega a /tareas', async () => {
    const mockLogin = vi.fn().mockResolvedValue(undefined)
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
    })

    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
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
      screen.getByRole('button', { name: 'Iniciar sesión' })
    )

    expect(mockLogin).toHaveBeenCalledTimes(1)
    expect(mockLogin).toHaveBeenCalledWith(
      'user@example.com',
      'password123'
    )
    expect(
      await screen.findByText('Página de tareas')
    ).toBeInTheDocument()
  })

  it('4. Error durante el login: muestra mensaje de error y no navega a /tareas', async () => {
    const mockLogin = vi
      .fn()
      .mockRejectedValue(new Error('Credenciales inválidas'))

    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
    })

    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
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
      screen.getByRole('button', { name: 'Iniciar sesión' })
    )

    expect(
      await screen.findByText(
        'El correo electrónico o la contraseña son incorrectos.'
      )
    ).toBeInTheDocument()
    expect(
      screen.queryByText('Página de tareas')
    ).not.toBeInTheDocument()
  })

  it('5. Estado de carga: deshabilita inputs y muestra "Iniciando sesión..." mientras el login está pendiente', async () => {
    const mockLogin = vi.fn().mockReturnValue(new Promise(() => {}))
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
    })

    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    const emailInput = screen.getByLabelText('Correo electrónico')
    const passwordInput = screen.getByLabelText('Contraseña')

    await user.type(emailInput, 'user@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(
      screen.getByRole('button', { name: 'Iniciar sesión' })
    )

    const submitButton = screen.getByRole('button', {
      name: 'Iniciando sesión...',
    })

    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
    expect(emailInput).toBeDisabled()
    expect(passwordInput).toBeDisabled()
  })
})

import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import { useAuth } from '../context/AuthContext'

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

const mockUseAuth = vi.mocked(useAuth)

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('debe mostrar "Cargando..." cuando loading es true', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      register: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
    })

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Contenido Protegido</div>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(screen.getByText('Cargando...')).toBeInTheDocument()
    expect(
      screen.queryByText('Contenido Protegido')
    ).not.toBeInTheDocument()
  })

  it('debe redirigir a /login cuando no hay usuario autenticado (loading: false)', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      register: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Contenido Protegido</div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={<div>Página de Login</div>}
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Página de Login')).toBeInTheDocument()
    expect(
      screen.queryByText('Contenido Protegido')
    ).not.toBeInTheDocument()
  })

  it('debe mostrar los children cuando el usuario está autenticado (loading: false)', () => {
    mockUseAuth.mockReturnValue({
      user: { uid: '12345', email: 'user@example.com' } as any,
      loading: false,
      register: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
    })

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Contenido Protegido</div>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(screen.getByText('Contenido Protegido')).toBeInTheDocument()
    expect(screen.queryByText('Cargando...')).not.toBeInTheDocument()
  })
})
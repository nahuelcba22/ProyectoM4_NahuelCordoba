import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import { useAuth } from './context/useAuth'

import Login from './pages/Login'
import Register from './pages/Register'
import Tasks from './pages/Tasks'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { user, logout } = useAuth()

  return (
    <BrowserRouter>
      <header className="main-header">
        <Link
          to={user ? '/tareas' : '/login'}
          className="main-logo"
        >
          <span className="logo-mi">Mi</span>
          <span className="logo-tarea">tarea</span>
        </Link>

        <nav className="main-nav">
          {user ? (
            <>
              {user.email && (
                <span className="user-email">
                  {user.email}
                </span>
              )}

              <Link
                to="/tareas"
                className="nav-link"
              >
                Mis tareas
              </Link>

              <button
                type="button"
                className="nav-logout"
                onClick={logout}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="nav-link"
              >
                Iniciar sesión
              </Link>

              <Link
                to="/registro"
                className="nav-register"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </nav>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to={user ? '/tareas' : '/login'}
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/registro"
          element={<Register />}
        />

        <Route
          path="/tareas"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
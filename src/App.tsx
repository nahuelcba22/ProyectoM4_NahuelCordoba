import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Tasks from './pages/Tasks'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <nav className="main-nav">
        <Link to="/login">Iniciar sesión</Link>
        <Link to="/registro">Crear cuenta</Link>
        <Link to="/tareas">Mis tareas</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route path="/registro" element={<Register />} />

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

import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setError('')

    if (!email || !password) {
      setError('Completá todos los campos.')
      return
    }

    try {
      setLoading(true)

      await register(email, password)

      navigate('/tareas')
    } catch {
      setError('No se pudo crear la cuenta. Verificá los datos e intentá nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Crear una cuenta</h1>

        <p className="login-subtitle">
          Registrate para comenzar a gestionar tus tareas.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>

            <input
              type="email"
              id="email"
              name="email"
              placeholder="Ingresá tu Gmail"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>

            <input
              type="password"
              id="password"
              name="password"
              placeholder="Creá una contraseña"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="register-link">
          ¿Ya tenés una cuenta?{' '}
          <Link to="/login">Iniciar sesión</Link>
        </p>
      </section>
    </main>
  )
}

export default Register
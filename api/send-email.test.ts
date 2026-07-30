import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const { mockSend } = vi.hoisted(() => ({
  mockSend: vi.fn(),
}))

vi.mock('@aws-sdk/client-ses', () => {
  return {
    SESClient: vi.fn().mockImplementation(function (this: { send: typeof mockSend }) {
      this.send = mockSend
    }),
    SendEmailCommand: vi.fn().mockImplementation(function (
      this: Record<string, unknown>,
      input: unknown
    ) {
      Object.assign(this, input)
    }),
  }
})

import handler from './send-email'

describe('api/send-email Serverless Function', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function createMockReqRes(method = 'POST', body: unknown = {}) {
    const req = {
      method,
      body,
    } as unknown as VercelRequest

    const res = {
      statusCode: 200,
      body: null as unknown,
      status: vi.fn().mockImplementation(function (
        this: { statusCode: number },
        code: number
      ) {
        this.statusCode = code
        return this
      }),
      json: vi.fn().mockImplementation(function (
        this: { body: unknown },
        data: unknown
      ) {
        this.body = data
        return this
      }),
    } as unknown as VercelResponse

    return { req, res }
  }

  it('1. Método HTTP no permitido: responde con status 405 en peticiones GET', async () => {
    const { req, res } = createMockReqRes('GET')

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(405)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Método no permitido.',
    })
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('2. Falta el destinatario: responde con status 400 cuando falta to', async () => {
    const { req, res } = createMockReqRes('POST', {
      tasks: [{ title: 'Tarea 1', completed: false }],
    })

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Faltan datos para enviar el email.',
    })
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('3. Falta la lista de tareas: responde con status 400 cuando falta tasks', async () => {
    const { req, res } = createMockReqRes('POST', {
      to: 'user@example.com',
    })

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Faltan datos para enviar el email.',
    })
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('4. Envío exitoso: responde con status 200 e invoca AWS SES con la información correcta', async () => {
    mockSend.mockResolvedValue({ MessageId: 'msg-12345' })

    const { req, res } = createMockReqRes('POST', {
      to: 'user@example.com',
      tasks: [
        {
          title: 'Tarea pendiente',
          completed: false,
        },
        {
          title: 'Tarea completada',
          completed: true,
        },
      ],
    })

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Email enviado correctamente.',
    })

    expect(mockSend).toHaveBeenCalledTimes(1)

    const sendCommandArg = mockSend.mock.calls[0][0]

    expect(sendCommandArg.Destination.ToAddresses).toContain(
      'user@example.com'
    )
    expect(sendCommandArg.Message.Subject.Data).toBe(
      'Resumen de tus tareas'
    )

    const bodyText = sendCommandArg.Message.Body.Text.Data
    expect(bodyText).toContain('Tarea pendiente')
    expect(bodyText).toContain('(Pendiente)')
    expect(bodyText).toContain('Tarea completada')
    expect(bodyText).toContain('(Completada)')
  })

  it('5. Error de AWS SES: responde con status 500 cuando el envío a AWS SES falla', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    mockSend.mockRejectedValue(new Error('Fallo del servicio SES'))

    const { req, res } = createMockReqRes('POST', {
      to: 'user@example.com',
      tasks: [
        {
          title: 'Tarea pendiente',
          completed: false,
        },
      ],
    })

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      message: 'No se pudo enviar el email.',
    })

    consoleErrorSpy.mockRestore()
  })
})

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      message: 'Método no permitido.',
    })
  }

  try {
    const { to, tasks } = req.body

    if (!to || !tasks) {
      return res.status(400).json({
        message: 'Faltan datos para enviar el email.',
      })
    }

    const taskList = tasks
      .map(
        (task: { title: string; completed: boolean }) =>
          `- ${task.title} ${
            task.completed ? '(Completada)' : '(Pendiente)'
          }`,
      )
      .join('\n')

    const command = new SendEmailCommand({
      Source: process.env.SES_FROM_EMAIL,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: 'Resumen de tus tareas',
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: `Hola.

Este es el resumen de tus tareas:

${taskList}

Saludos,
Gestor Estratégico de Tareas`,
            Charset: 'UTF-8',
          },
        },
      },
    })

    await sesClient.send(command)

    return res.status(200).json({
      message: 'Email enviado correctamente.',
    })
  } catch (error) {
    console.error('Error al enviar el email:', error)

    return res.status(500).json({
      message: 'No se pudo enviar el email.',
    })
  }
}
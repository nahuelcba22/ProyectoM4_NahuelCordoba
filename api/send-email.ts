import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export default async function handler(
  request: Request,
): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({
        message: 'Método no permitido.',
      }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }

  try {
    const body = await request.json()

    const { to, tasks } = body

    if (!to || !tasks) {
      return new Response(
        JSON.stringify({
          message: 'Faltan datos para enviar el email.',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
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

    return new Response(
      JSON.stringify({
        message: 'Email enviado correctamente.',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error('Error al enviar el email:', error)

    return new Response(
      JSON.stringify({
        message: 'No se pudo enviar el email.',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }
}
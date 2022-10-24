import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import { prisma } from '../prisma'
import { createServer } from 'http'

const app = express()
app.use(express.json())
app.use(cors())

app.get('/flow', async (request, response) => {
  const flow = await prisma.flow.findMany({
    select: {
      id: true,
      message: true,
      name: true,
      buttons: {
        select: {
          id: true,
          body: true,
        }
      }
    }
  })

  return response.json(flow)
})

app.post('/flow', async (request, response) => {
  const { name, message } = request.body

  const flowExists = await prisma.flow.findUnique({
    where: { name_createdBy: { createdBy: 'admin', name } }
  })

  if (flowExists) return response.status(400).json({ error: 'Flow already exists' })

  const flow = await prisma.flow.create({
    data: {
      name,
      message,
      createdBy: 'admin',
    }
  })

  return response.json(flow)
})

app.put('/flow/:id', async (request, response) => {
  const { id } = request.params
  const { buttons, message } = request.body

  const flowExists = await prisma.flow.findUnique({
    where: { id }
  })

  if (!flowExists) return response.status(400).json({ error: 'Flow does not exists' })

  const flow = await prisma.flow.update({
    where: { id },
    data: {
      buttons,
      message
    }
  })

  return response.json(flow)
})

app.delete('/flow/:id', async (request, response) => {
  const { id } = request.params

  const flowExists = await prisma.flow.findUnique({
    where: { id }
  })

  if (!flowExists) return response.status(400).json({ error: 'Flow does not exists' })

  await prisma.flow.delete({
    where: { id },
  })

  return response.status(204).send()
})

app.get('/button', async (request, response) => {
  const button = await prisma.button.findMany({
    select: {
      id: true,
      body: true,
    }
  })

  return response.json(button)
})

export const httpServer = createServer(app)

export const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
})

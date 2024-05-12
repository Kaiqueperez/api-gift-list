import { PrismaClient } from '@prisma/client'
import fastify from 'fastify'
import GiftV1 from './GiftsV1'

const fastifyInstance = fastify()

const prismaInstance = new PrismaClient()

const giftAPI = new GiftV1(fastifyInstance, prismaInstance)

giftAPI.initializeListener()

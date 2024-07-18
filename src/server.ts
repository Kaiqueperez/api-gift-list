import { PrismaClient } from '@prisma/client'
import fastify from 'fastify'
import GiftV1 from './Controller/GiftV1'
import GiftV1Service from './Service/GiftV1Service'

const fastifyInstance = fastify()

const prismaInstance = new PrismaClient()

const giftService = new GiftV1Service(prismaInstance)

const giftAPI = new GiftV1(fastifyInstance, giftService)

giftAPI.initializeListener()

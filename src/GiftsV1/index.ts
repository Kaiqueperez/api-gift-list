import { fastifyCors } from '@fastify/cors'
import { PrismaClient } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import { giftSchema, gifterSchema, idSchema, isChoosenSchema } from '../schemas'

export default class GiftV1 {
  private fastify
  private prisma
  private BASE_URL = '/gifts/v1'
  constructor(fastify: FastifyInstance, prisma: PrismaClient) {
    this.fastify = fastify
    this.prisma = prisma

    this.fastify.register(fastifyCors, {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    })
    this.setupRoutes()
  }

  private setupRoutes() {
    this.createGiftOnDataBase()
    this.getAllChosenGifts()
    this.getGitftsByPersonName()
    this.updateGitf()
    this.getAllGifts()
    this.deleteAllData()
  }

  private async createGiftOnDataBase() {
    this.fastify.post(`${this.BASE_URL}/product`, async (request, response) => {
      const { name, url, imageUrl, description } = giftSchema.parse(
        request.body
      )

      const gift = {
        name,
        url,
        imageUrl,
        description,
      }

      if (
        !name.trim() ||
        !url.trim().includes('http') ||
        !imageUrl.trim() ||
        !description.trim()
      ) {
        return response.code(400).send({
          message: `Vefique os campos, eles não pode ser enviados vazios: ${
            name ? name : 'Campo nome está vazio'
          }, ${url ? url : 'Campo url está vazio'}, ${
            imageUrl ? imageUrl : 'Campo imagem está vazio'
          }, ${description ? description : 'Campo descrição está vazio'}`,
          code: response.statusCode,
        })
      }

      try {
        await this.prisma.gift.create({
          data: gift,
        })

        return response.code(201).send({
          message: 'Presente criado com sucesso',
        })
      } catch (error) {
        return response.code(400).send({
          error,
        })
      }
    })
  }

  private async updateGitf() {
    this.fastify.patch(
      `${this.BASE_URL}/product/:id`,
      async (request, response) => {
        const { personName, choosen } = gifterSchema.parse(request.body)
        const { id } = idSchema.parse(request.params)

        try {
          await this.prisma.gift.update({
            where: {
              id,
            },
            data: {
              personName,
              choosen,
            },
          })

          const gifts = await this.prisma.gift.findMany()

          return response.code(200).send({
            message: `Muito obrigado ${personName} por escolher um presente para o casal`,
            showBuyButton: !!personName,
            buyMessage: 'Gostaria de comprar agora?',
            gifts,
          })
        } catch (error) {
          return {
            message: error,
          }
        }
      }
    )
  }

  private async getAllGifts() {
    this.fastify.get(`${this.BASE_URL}/products`, async (_, response) => {
      const gifts = await this.prisma.gift.findMany()
      try {
        return await response.send(gifts)
      } catch (error) {
        return response.code(404).send({
          message: 'Não foram achados os presentes solicitados',
        })
      }
    })
  }

  private async getGitftsByPersonName() {
    this.fastify.get(
      `${this.BASE_URL}/products/:personName`,
      async (request, response) => {
        const { personName } = gifterSchema.parse(request.params)

        const gifts = await this.prisma.gift.findMany({
          where: {
            personName: {
              mode: 'insensitive',
              equals: personName,
            },
          },
        })
        try {
          return await response.send(gifts)
        } catch (error) {
          return await response.code(404).send({
            message: 'O nome passado não está associado a nenhum presente',
          })
        }
      }
    )
  }

  private async getAllChosenGifts() {
    this.fastify.get(
      `${this.BASE_URL}/products/choosen/:choosen`,

      async (request, response) => {
        const { choosen } = isChoosenSchema.parse(request.params)

        const isChoosen = choosen === 'true'

        const gifts = await this.prisma.gift.findMany({
          where: {
            choosen: isChoosen,
          },
        })

        try {
          return await response.send(gifts)
        } catch (error) {
          return await response.code(404)
        }
      }
    )
  }

  private async deleteAllData() {
    this.fastify.delete(
      `${this.BASE_URL}/products/delete`,
      async (_, response) => {
        await this.prisma.gift.deleteMany({})
        const emptyList = await this.prisma.gift.findMany()
        try {
          return {
            code: response.statusCode,
            message: 'Os produtos foram deletados com sucesso',
            emptyList,
          }
        } catch (error) {
          return {
            code: response.statusCode,
            message: error,
          }
        }
      }
    )
  }

  initializeListener() {
    this.fastify.listen(
      {
        host: '0.0.0.0',
        port: process.env.PORT ? Number(process.env.PORT) : 3333,
      },
      () => {
        console.log('Server Running')
      }
    )
  }
}

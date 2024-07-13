import { fastifyCors } from '@fastify/cors'
import { PrismaClient } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import { giftSchema, gifterSchema, idSchema, isChoosenSchema } from '../schemas'
import GiftV1Service from '../Service/GiftV1Service'

export default class GiftV1 {
  public fastify
  public prisma
  public service
  public BASE_URL = '/gifts/v1'
  constructor(
    fastify: FastifyInstance,
    prisma: PrismaClient,
    service: GiftV1Service
  ) {
    this.fastify = fastify
    this.prisma = prisma
    this.service = service
    this.fastify.register(fastifyCors, {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    })
    this.setupRoutes()
  }

  public setupRoutes() {
    this.createGiftOnDataBase()
    this.getAllChosenGifts()
    this.getGitftsByPersonName()
    this.updateGitf()
    this.getAllGifts()
    this.deleteGiftById()
  }

  public async createGiftOnDataBase() {
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

      const { hasError, error } = await this.service.createGiftService(gift)

      if (hasError) {
        return response.code(400).send({
          message: error,
        })
      }

      return response.code(201).send({
        message: 'Presente criado com sucesso',
      })
    })
  }

  public async updateGitf() {
    this.fastify.patch(
      `${this.BASE_URL}/product/:id`,
      async (request, response) => {
        const { personName, choosen } = gifterSchema.parse(request.body)
        const { id } = idSchema.parse(request.params)

        const personData = {
          id,
          personName,
          choosen,
        }

        const { hasError, error } = await this.service.updateGiftService(
          personData
        )

        if (hasError) {
          return response.code(400).send({
            message: error,
          })
        }

        return response.code(200).send({
          message: `Muito obrigado ${personName} por escolher um presente para o casal`,
          showBuyButton: !!personName,
          buyMessage: 'Gostaria de comprar agora?',
        })
      }
    )
  }

  public async getAllGifts() {
    this.fastify.get(`${this.BASE_URL}/products`, async (_, response) => {
      const { gifts, hasError, error } = await this.service.getAllGiftService()

      if (hasError) {
        return response.code(404).send({
          message: 'Não foram achados os presentes solicitados',
          error,
        })
      }

      return await response.code(200).send(gifts)
    })
  }

  public async getGitftsByPersonName() {
    this.fastify.get(
      `${this.BASE_URL}/products/:personName`,
      async (request, response) => {
        const { personName } = gifterSchema.parse(request.params)
        const formatedPersonName = personName?.replace(/-/g, ' ')

        const { gifts, hasError, error } =
          await this.service.getGiftByNameService(formatedPersonName)

        if (hasError) {
          return response.code(404).send({
            message: 'Não foram achados os presentes solicitados',
            error,
          })
        }

        return await response.code(200).send(gifts)
      }
    )
  }

  public async getAllChosenGifts() {
    this.fastify.get(
      `${this.BASE_URL}/products/choosen/:choosen`,

      async (request, response) => {
        const { choosen } = isChoosenSchema.parse(request.params)

        const isChoosen = choosen === 'true'

        const { hasError, gifts } = await this.service.getAllChosenGiftsService(
          isChoosen
        )

        if (hasError) {
          return await response.code(404).send({
            message: 'Não foram achados os presentes solicitados',
          })
        }

        return await response.code(200).send(gifts)
      }
    )
  }

  public async deleteGiftById() {
    this.fastify.delete(
      `${this.BASE_URL}/products/delete/:id`,
      async (request, response) => {
        const { id } = idSchema.parse(request.params)
        const { hasError, deletedGift, error } =
          await this.service.deleteGiftByIdService(id)

        if (hasError) {
          return response.code(404).send({
            message: 'Não foi possível deletar o presente',
            error,
          })
        }

        return {
          code: response.statusCode,
          message: 'O produto foi deletado com sucesso',
          deletedGift,
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

import Fastify from 'fastify'
import { FastifyInstance } from 'fastify'
import GiftV1 from '../src/Controller/GiftV1'
import GiftV1Service from '../src/Service/GiftV1Service'

const createGiftServiceMock = jest.fn()

const mockGiftV1Service = {
  createGiftService: createGiftServiceMock,
} as unknown as GiftV1Service

let fastify: FastifyInstance

beforeAll(async () => {
  fastify = Fastify()
  const api = new GiftV1(fastify, mockGiftV1Service)
  api.initializeListener()
  await fastify.ready()
})

afterAll(async () => {
  await fastify.close()
})

describe('POST /gifts/v1/product', () => {
  it('should create a gift successfully', async () => {
    createGiftServiceMock.mockResolvedValue({
      hasError: false,
      error: null,
    })

    const response = await fastify.inject({
      method: 'POST',
      url: '/gifts/v1/product',
      payload: {
        name: 'Gift Name',
        url: 'http://example.com',
        imageUrl: 'http://example.com/image.jpg',
        description: 'A wonderful gift',
      },
    })

    expect(response.statusCode).toBe(201)
    expect(response.payload).toContain('Presente criado com sucesso')
    fastify.close()
  }, 30000)

  it('should return a 400 error if fields are missing', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/gifts/v1/product',
      payload: {
        name: '',
        url: 'http://example.com',
        imageUrl: '',
        description: '',
      },
    })

    expect(response.statusCode).toBe(400)
    expect(response.payload).toContain('Campo nome está vazio')
    expect(response.payload).toContain('Campo imagem está vazio')
    expect(response.payload).toContain('Campo descrição está vazio')
  })
})

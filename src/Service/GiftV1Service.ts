import { PrismaClient } from '@prisma/client'

type Gift = {
  name: string
  url: string
  imageUrl: string
  description: string
}

type GiftUpdate = {
  id: string
  personName: PersonName
  choosen: boolean | undefined
}

type PersonName = string | undefined

export default class GiftV1Service {
  private prisma
  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  public async createGiftService(gift: Gift) {
    try {
      await this.prisma.gift.create({
        data: gift,
      })

      return { hasError: false }
    } catch (error) {
      return { hasError: true, error }
    }
  }

  public async updateGiftService(personData: GiftUpdate) {
    const { id, personName, choosen } = personData

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

      return { hasError: false, gifts }
    } catch (error) {
      return { hasError: true, error }
    }
  }

  public async getAllGiftService() {
    try {
      const gifts = await this.prisma.gift.findMany()

      return { hasError: false, gifts }
    } catch (error) {
      return { hasError: true, error }
    }
  }

  public async getGiftByNameService(personName: PersonName) {
    try {
      const gifts = await this.prisma.gift.findMany({
        where: {
          personName: {
            mode: 'insensitive',
            contains: personName,
          },
        },
      })

      return { hasError: false, gifts }
    } catch (error) {
      return { hasError: true, error }
    }
  }

  public async getAllChosenGiftsService(isChoosen: boolean) {
    const gifts = await this.prisma.gift.findMany({
      where: {
        choosen: isChoosen,
      },
    })

    const hasError = gifts.length === 0

    return { hasError, gifts }
  }

  public async deleteGiftByIdService(id: string) {
    try {
      const deletedGift = await this.prisma.gift.delete({
        where: { id },
      })

      return { hasError: false, deletedGift }
    } catch (error) {
      return { hasError: true, error }
    }
  }
}

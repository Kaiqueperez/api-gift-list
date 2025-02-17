import GiftV1Service from '../src/Service/GiftV1Service'
import { prismaMock } from '../src/singleton'

describe('GiftV1Service', () => {

    let service: GiftV1Service | undefined

    beforeEach(() => {
        service = new GiftV1Service(prismaMock)
    })

    it('should create a gift', async () => {
        const gift = {
            name: 'test',
            url: 'test',
            imageUrl: 'test',
            description: 'test',
        }

        prismaMock.gift.create.mockResolvedValue(gift)

        const result = await service?.createGiftService(gift)
        expect(result?.hasError).toBe(false)
    })

})
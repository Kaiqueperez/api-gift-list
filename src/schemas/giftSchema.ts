import { z } from 'zod'

const giftSchema = z.object({
  name: z.string(),
  url: z.string(),
  imageUrl: z.string(),
  description: z.string(),
})

const gifterSchema = z.object({
  personName: z.string().optional(),
  choosen: z.boolean().optional(),
})

const idSchema = z.object({
  id: z.string(),
})

const isChoosenSchema = z.object({
  choosen: z.string().optional(),
})

export { gifterSchema, giftSchema, idSchema, isChoosenSchema }


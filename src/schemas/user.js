import { z } from 'zod'

const userSchema = z.object({
  username: z.string().min(6).max(15),
  email: z.string().email(),
  password: z.string().min(6).max(12),
})

export const validateUser = (user) => {
  return userSchema.safeParse(user)
}

export const validatePartialUser = (user) => {
  return userSchema.partial().safeParse(user)
}

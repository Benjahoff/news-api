import { z } from 'zod'

const newSchema = z.object({
  author: z.string({
    required_error: 'Author is a required field.',
  }),
  title: z.string({
    required_error: 'Title is a required field.',
  }),
  subtitle: z.string({
    required_error: 'Subtitle is a required field.',
  }),
  category: z.string({
    required_error: 'Category is a required field.',
  }),
  urlToImage: z.string().url({
    message: 'urlToImage must be a valid URL.',
    required_error: 'urlToImage is a required field.',
  }),
  content: z.string({
    required_error: 'Content is a required field.',
  }),
});

export const validateNew = (news) => {
  return newSchema.safeParse(news)
}

export const validatePartialNew = (news) => {
  return newSchema.partial().safeParse(news)
}

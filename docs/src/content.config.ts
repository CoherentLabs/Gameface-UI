import { docsLoader } from '@astrojs/starlight/loaders'
import { docsSchema } from '@astrojs/starlight/schema'
import { defineCollection } from 'astro:content'
import { z } from 'astro:content'
import { topicSchema } from 'starlight-sidebar-topics/schema'

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: ({ image }) =>
        z
          .object({
            recipe: z
              .object({
                author: z.string().optional(),
                difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
                tags: z.array(z.string()).default([]),
                thumbnail: image().optional(),
              })
              .optional(),
          })
          .merge(topicSchema),
    }),
  }),
}

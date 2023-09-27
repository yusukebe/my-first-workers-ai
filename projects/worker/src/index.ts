import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Ai } from '@cloudflare/ai'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

type Bindings = {
  AI: Ai
}

type Answer = {
  response: string
}

const schema = z.object({
  messages: z.array(
    z.object({
      role: z.string(),
      content: z.string()
    })
  )
})
const app = new Hono<{ Bindings: Bindings }>()

app.post('/ai', cors(), zValidator('json', schema), async (c) => {
  const { messages } = c.req.valid('json')

  const ai = new Ai(c.env.AI)
  const answer: Answer = await ai.run('@cf/meta/llama-2-7b-chat-int8', {
    messages
  })

  return c.json(answer)
})

app.onError((e, c) => {
  console.log(e.message)
  return c.json({
    ok: false
  })
})

export default app

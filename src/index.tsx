import { Hono } from 'hono'
import { renderer } from './renderer'
import { Ai } from '@cloudflare/ai'
import script from '../assets/script.js'

type Bindings = {
  AI: any
}

type Answer = {
  response: string
}

type Message = {
  content: string
  role: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/script.js', (c) => {
  return c.body(script, 200, {
    'Content-Type': 'text/javascript'
  })
})

app.get('*', renderer)

app.get('/', (c) => {
  return c.render(
    <>
      <h2>You</h2>
      <form id="input-form" autocomplete="off" method="post">
        <input
          type="text"
          name="query"
          style={{
            width: '100%'
          }}
        />
        <button type="submit">Send</button>
      </form>
      <h2>AI</h2>
      <pre
        id="ai-content"
        style={{
          'white-space': 'pre-wrap'
        }}
      ></pre>
    </>
  )
})

app.post('/ai', async (c) => {
  const { messages } = await c.req.json<{ messages: Message[] }>()
  const ai = new Ai(c.env.AI)
  const answer: Answer = await ai.run('@cf/meta/llama-2-7b-chat-int8', {
    messages
  })

  const translationResponse: {
    translated_text: string
  } = await ai.run('@cf/meta/m2m100-1.2b', {
    text: answer.response,
    source_lang: 'english',
    target_lang: 'japanese'
  })

  const strings = [...translationResponse.translated_text]
  return c.streamText(async (stream) => {
    for (const s of strings) {
      stream.write(s)
      await stream.sleep(10)
    }
  })
})

export default app

import { Hono } from 'hono'
import { renderer } from './renderer'
import { Ai } from '@cloudflare/ai'
import script from '../assets/script.js'

type Bindings = {
  AI: any
}

export type Message = {
  content: string
  role: 'user' | 'system' | 'assistant'
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
          autofocus
        />
        <button id="button" type="submit">
          Send
        </button>
        &nbsp;
        <button onclick="event.preventDefault(); window.location.href='/'">Reload</button>
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

const initialMessage: Message = {
  role: 'system',
  content: `You are a helpful assistant. You must not respond as 'User' or pretend to be 'User'. You must only respond once as 'Assistant' in less than 100 words.`
}

app.post('/ai', async (c) => {
  const { messages } = await c.req.json<{ messages: Message[] }>()
  messages.unshift(initialMessage)

  const ai = new Ai(c.env.AI)
  const stream = await ai.run('@cf/meta/llama-2-7b-chat-int8', {
    messages: messages,
    stream: true
  })

  return c.body(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Transfer-Encoding': 'chunked'
    }
  })
})

export default app

import { useState, useEffect, useRef } from 'react'

type Message = {
  role: 'assistant' | 'user'
  content: string
}

const messages: Message[] = []

export default function Component(props: { baseURL: string }) {
  const [status, setStatus] = useState('')
  const [userInput, setUserInput] = useState('')
  const url = new URL('/ai', props.baseURL)

  const fetchMessages = async () => {
    setStatus('loading...')
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          messages: [...messages].reverse()
        })
      })

      if (!res.body) {
        setStatus('No response body.')
        return
      }

      if (!res.ok) {
        console.log(await res.text())
        setStatus('Error occurred.')
        return
      }

      const data = await res.json<{ response: string }>()

      messages.unshift({
        role: 'assistant',
        content: data.response
      })
      setStatus('')
    } catch (error) {
      console.error(error)
      setStatus('Network error.')
    }
  }

  useEffect(() => {
    if (!import.meta.env.SSR) {
      messages.unshift({
        role: 'user',
        content: `You are a helpful assistant. You do not respond as 'User' or pretend to be 'User'. You only respond once as 'Assistant'.`
      })
      fetchMessages()
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    messages.unshift({
      role: 'user',
      content: userInput
    })
    fetchMessages()
    setUserInput('')
  }

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            style={{ width: '30rem', marginRight: '2px' }}
            value={userInput}
            onChange={(e) => setUserInput((e.target as any).value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
      <div>
        <p>{status}</p>
      </div>
      {messages.map((message, index) => {
        return (
          <div key={index}>
            <h3>{message.role === 'user' ? 'You' : 'AI'}</h3>
            <pre>{message.content}</pre>
          </div>
        )
      })}
    </div>
  )
}

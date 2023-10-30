let loading = false
const messages = []
const maxMessage = 21 // should be odd

function getMessages() {
  const messagesLength = messages.length
  const messageStart = messagesLength - maxMessage
  return messages.slice(messageStart < 0 ? 0 : messageStart, messagesLength)
}

async function sendMessages(target) {
  const response = await fetch('/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messages: getMessages()
    })
  })

  // Server Error!
  if (!response.ok) {
    target.innerHTML = response.statusText
    loading = false
    return
  }

  target.innerHTML = ''
  const reader = response.body?.getReader()
  if (!reader) return
  let decoder = new TextDecoder()

  let chunk = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    let data = decoder.decode(value)

    // Error!
    if (data.startsWith('{"errors"')) {
      target.innerHTML = data
      loading = false
      return
    }

    chunk += data
    const splittedChunk = chunk.split('\n\n').filter((e) => !!e)
    if (splittedChunk.length <= 1) continue
    if (splittedChunk.some((c) => c === 'data: [DONE]')) break
    chunk = ''
    for (c of splittedChunk) {
      const response = JSON.parse(c.split('data:')[1])['response']
      target.innerHTML += response
    }
  }

  messages.push({
    role: 'assistant',
    content: target.innerHTML.trim()
  })
  loading = false
}

function init(target) {
  messages.push({
    role: 'user',
    content: 'Hello'
  })
  loading = true
  sendMessages(target)
}

document.addEventListener('DOMContentLoaded', function () {
  const target = document.getElementById('ai-content')
  document.getElementById('input-form').addEventListener('submit', function (event) {
    event.preventDefault()
    if (loading) return
    const formData = new FormData(event.target)
    const query = formData.get('query')
    messages.push({
      role: 'user',
      content: query
    })
    loading = true
    target.innerHTML = 'loading...'
    sendMessages(target)
  })
  init(target)
})

const messages = [
  {
    role: 'user',
    content: `You are a helpful assistant. You do not respond as 'User' or pretend to be 'User'. You respond as 'Assistant'. You respond in less than 100 words.`
  }
]

document.addEventListener('DOMContentLoaded', function () {
  const target = document.getElementById('ai-content')
  fetchChunked(target)
  document.getElementById('input-form').addEventListener('submit', function (event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const query = formData.get('query')
    messages.push({
      role: 'user',
      content: query
    })
    fetchChunked(target)
  })
})

function fetchChunked(target) {
  target.innerHTML = 'loading...'
  fetch('/ai', {
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ messages })
  }).then((response) => {
    const reader = response.body.getReader()
    let decoder = new TextDecoder()
    target.innerHTML = ''
    reader.read().then(function processText({ done, value }) {
      if (done) {
        messages.push({
          role: 'assistant',
          content: target.innerHTML
        })
        return
      }
      target.innerHTML += decoder.decode(value)
      return reader.read().then(processText)
    })
  })
}

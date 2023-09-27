import type { Context } from 'sonik'
import Component from '../islands/component'

export default function Index(c: Context) {
  return c.render(
    <div>
      <Component baseURL="https://my-first-ai.yusukebe.workers.dev" />
    </div>,
    {
      title: 'My first Workers AI',
      meta: [{ name: 'description', content: 'This is my first project using Workers AI' }]
    }
  )
}

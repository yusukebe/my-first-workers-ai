import { Context } from 'hono'

export const renderer = (c: Context) => (content: string) => {
  return c.html(
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div>{content}</div>
      </body>
    </html>
  )
}

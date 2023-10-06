import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => (
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="/script.js"></script>
    </head>
    <body>
      <header>
        <h1>My first Workers AI</h1>
      </header>
      <div>{children}</div>
    </body>
  </html>
))

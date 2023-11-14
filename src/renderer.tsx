import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(
  ({ children }) => (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@exampledev/new.css@1.1.2/new.min.css" />
        <script src="/script.js"></script>
      </head>
      <body>
        <header>
          <h1>My first Workers AI</h1>
        </header>
        <div>{children}</div>
      </body>
    </html>
  ),
  {
    docType: true
  }
)

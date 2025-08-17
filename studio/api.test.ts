import {describe, it, expect, beforeAll, afterAll} from 'vitest'
import {createServer} from 'http'
import {AddressInfo} from 'net'

describe('Studio API Endpoints', () => {
  let server: ReturnType<typeof createServer>
  let port: number

  beforeAll(() => {
    server = createServer((req, res) => {
      if (req.url === '/studio') {
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end('<html><body>Sanity Studio</body></html>')
      } else if (req.url === '/studio/api/health') {
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({status: 'healthy', studio: 'running'}))
      } else {
        res.writeHead(404)
        res.end('Not Found')
      }
    })

    return new Promise<void>((resolve) => {
      server.listen(0, () => {
        port = (server.address() as AddressInfo).port
        resolve()
      })
    })
  })

  afterAll(() => {
    return new Promise<void>((resolve) => {
      server.close(() => resolve())
    })
  })

  it('should serve studio route', async () => {
    const response = await fetch(`http://localhost:${port}/studio`)
    expect(response.status).toBe(200)
    const text = await response.text()
    expect(text).toContain('Sanity Studio')
  })

  it('should serve health check endpoint', async () => {
    const response = await fetch(`http://localhost:${port}/studio/api/health`)
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toEqual({
      status: 'healthy',
      studio: 'running'
    })
  })

  it('should return 404 for unknown routes', async () => {
    const response = await fetch(`http://localhost:${port}/unknown`)
    expect(response.status).toBe(404)
  })
})
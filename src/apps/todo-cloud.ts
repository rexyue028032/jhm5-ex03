// 簡易的 Todo Cloud API，使用 Cloudflare KV（binding: JHM5_EX03_TODO）
export default {
  async handleList(req: Request) {
    const url = new URL(req.url)
    const user = url.searchParams.get('user') || 'anonymous'
    const raw = await (globalThis as any).JHM5_EX03_TODO.get(user)
    const items = raw ? JSON.parse(raw) : []
    return new Response(JSON.stringify(items), { status: 200, headers: { 'content-type': 'application/json; charset=utf-8' } })
  },
  async handleCreate(req: Request) {
    const user = (new URL(req.url)).searchParams.get('user') || 'anonymous'
    const body = await req.json()
    const raw = await (globalThis as any).JHM5_EX03_TODO.get(user)
    const items = raw ? JSON.parse(raw) : []
    const id = Date.now().toString(36)
    const item = { id, text: body.text || '', done: false, createdAt: Date.now() }
    items.push(item)
    await (globalThis as any).JHM5_EX03_TODO.put(user, JSON.stringify(items))
    return new Response(JSON.stringify(item), { status: 201, headers: { 'content-type': 'application/json; charset=utf-8' } })
  },
  async handleUpdate(req: Request) {
    const url = new URL(req.url)
    const user = url.searchParams.get('user') || 'anonymous'
    const id = url.pathname.split('/').pop()
    const body = await req.json()
    const raw = await (globalThis as any).JHM5_EX03_TODO.get(user)
    const items = raw ? JSON.parse(raw) : []
    const idx = items.findIndex((t: any) => t.id === id)
    if (idx === -1) return new Response('Not Found', { status: 404 })
    items[idx] = { ...items[idx], ...body }
    await (globalThis as any).JHM5_EX03_TODO.put(user, JSON.stringify(items))
    return new Response(JSON.stringify(items[idx]), { status: 200, headers: { 'content-type': 'application/json; charset=utf-8' } })
  },
  async handleDelete(req: Request) {
    const url = new URL(req.url)
    const user = url.searchParams.get('user') || 'anonymous'
    const id = url.pathname.split('/').pop()
    const raw = await (globalThis as any).JHM5_EX03_TODO.get(user)
    let items = raw ? JSON.parse(raw) : []
    items = items.filter((t: any) => t.id !== id)
    await (globalThis as any).JHM5_EX03_TODO.put(user, JSON.stringify(items))
    return new Response(null, { status: 204 })
  }
}

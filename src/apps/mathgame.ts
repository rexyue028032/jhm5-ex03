// 簡易數學遊戲排行榜 API
export default {
  async getLeaderboard(req: Request) {
    const raw = await (globalThis as any).JHM5_EX03_TODO.get('math_leaderboard')
    const list = raw ? JSON.parse(raw) : []
    return new Response(JSON.stringify(list), { status: 200, headers: { 'content-type': 'application/json; charset=utf-8' } })
  },
  async submitScore(req: Request) {
    const body = await req.json()
    const name = body.name || '匿名'
    const score = Number(body.score) || 0
    const raw = await (globalThis as any).JHM5_EX03_TODO.get('math_leaderboard')
    const list = raw ? JSON.parse(raw) : []
    list.push({ name, score, at: Date.now() })
    list.sort((a: any, b: any) => b.score - a.score)
    await (globalThis as any).JHM5_EX03_TODO.put('math_leaderboard', JSON.stringify(list.slice(0, 100)))
    return new Response(JSON.stringify({ ok: true }), { status: 201, headers: { 'content-type': 'application/json; charset=utf-8' } })
  }
}

import todoCloud from './apps/todo-cloud'
import mathgame from './apps/mathgame'

addEventListener('fetch', (event: any) => {
  const req = event.request
  const url = new URL(req.url)
  const path = url.pathname

  async function route() {
    try {
      if (path === '/api/todo-cloud' && req.method === 'GET') return todoCloud.handleList(req)
      if (path === '/api/todo-cloud' && req.method === 'POST') return todoCloud.handleCreate(req)
      if (path.startsWith('/api/todo-cloud/') && req.method === 'PUT') return todoCloud.handleUpdate(req)
      if (path.startsWith('/api/todo-cloud/') && req.method === 'DELETE') return todoCloud.handleDelete(req)

      if (path === '/api/mathgame/leaderboard' && req.method === 'GET') return mathgame.getLeaderboard(req)
      if (path === '/api/mathgame/score' && req.method === 'POST') return mathgame.submitScore(req)

      // Let the Workers Sites handle static assets (site.bucket = public)
      return fetch(req)
    } catch (e) {
      return new Response('Internal Server Error', { status: 500 })
    }
  }

  event.respondWith(route())
})

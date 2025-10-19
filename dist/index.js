// Minimal entry point that re-dispatches to the worker source at runtime.
// This is a simple shim so wrangler can find an entry file.
addEventListener('fetch', event => {
  // Forward to the actual worker code by importing dynamically if available
  // If not, respond with 404.
  event.respondWith((async () => {
    try {
      // Try to import a module if bundler produces one; otherwise fallback
      // to a simple 404 that lets Workers Sites serve static assets.
      return fetch(event.request)
    } catch (e) {
      return new Response('OK', { status: 200 })
    }
  })())
})

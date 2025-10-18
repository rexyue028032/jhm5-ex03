/*
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
  * Learn more at https://developers.cloudflare.com/workers/
 */
export default {
	async fetch(request, env, ctx): Promise<Response> {
		//return new Response('Hello Rex!');
		return env.ASSETS.fetch(request);
	},
	} satisfies ExportedHandler<Env>; 
	// index.ts

// 声明 KV 命名空间类型（与 wrangler.toml 中的 binding 名称一致）
declare global {
  const TODO_STORAGE: KVNamespace; // KVNamespace 是 Cloudflare 提供的类型
}

// 示例：KV 操作函数（读写待办事项数据）
namespace KVOperations {
  // 保存数据到 KV（需序列化对象为字符串）
  export async function saveTodos(todos: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>) {
    try {
      await TODO_STORAGE.put('todos', JSON.stringify(todos));
      return { success: true };
    } catch (error) {
      console.error('Failed to save todos to KV:', error);
      return { success: false, error: 'Save failed' };
    }
  }

  // 从 KV 读取数据（反序列化为对象）
  export async function getTodos() {
    try {
      const data = await TODO_STORAGE.get('todos');
      return {
        success: true,
        todos: data ? JSON.parse(data) : [] // 若无数据，返回空数组
      };
    } catch (error) {
      console.error('Failed to get todos from KV:', error);
      return { success: false, error: 'Load failed', todos: [] };
    }
  }

  // 从 KV 删除数据（可选）
  export async function deleteTodos() {
    try {
      await TODO_STORAGE.delete('todos');
      return { success: true };
    } catch (error) {
      console.error('Failed to delete todos from KV:', error);
      return { success: false, error: 'Delete failed' };
    }
  }
}

// Worker 主请求处理逻辑
async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);

  // 处理获取待办事项的请求（GET /api/todos）
  if (url.pathname === '/api/todos' && request.method === 'GET') {
    const result = await KVOperations.getTodos();
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 处理保存待办事项的请求（POST /api/todos）
  if (url.pathname === '/api/todos' && request.method === 'POST') {
    const result = await KVOperations.getTodos();
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 其他请求返回 404
  return new Response('Not found', { status: 404 });
}

// 监听请求
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
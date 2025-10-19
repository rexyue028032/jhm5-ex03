# jhm5-ex03

Cloudflare Worker 專案示範，內含四個小型應用：井字遊戲、Local Todo、Cloud Todo（KV）、限時數學遊戲（排行榜）。

快速啟動：

1. 安裝依賴：

```bash
npm install
```

2. 本地開發（需要 wrangler 已安裝）：

```bash
npx wrangler dev
```

3. 部署：

```bash
npx wrangler publish
```

注意事項：

- 本範例使用簡潔、極簡風格的前端實作，目的是示範功能與整合方式。
- 請在 wrangler 設定中把 KV namespace 的 id 與 preview_id 填入，binding 名稱為 jhm5-ex03 規範下的 JHM5_EX03_TODO。
# jhm5-ex03 

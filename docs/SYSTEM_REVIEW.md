# LocalAuth 系統檢查報告

## 嚴重 (Critical)

| 項目 | 說明 | 建議 |
|------|------|------|
| JWT_SECRET 預設值 | `auth.module.ts`、`jwt.strategy.ts` 未設定時用 `default-secret` | 生產環境應強制要求，未設定時啟動失敗 |
| 管理 API 無保護 | `GET /users`、`GET /users/:id`、`DELETE /users/:id` 無 JwtAuthGuard | 任何人可列舉、刪除用戶，應加認證 |
| Admin UI 無保護 | `/admin` 靜態頁面無驗證 | 需登入後才能管理用戶，或限制 IP/來源 |
| docker-compose JWT | `JWT_SECRET: change-me-in-production` | 生產部署務必覆寫 |

## 高 (High)

| 項目 | 說明 | 建議 |
|------|------|------|
| CORS 完全開放 | `app.enableCors()` 允許所有 origin | 生產環境應限制 `origin` |
| email_verified 錯誤 | `getUserInfo` 寫死 `true` | 應改為 `user.emailVerified` |
| 錯誤處理不當 | `throw new Error()` 回傳 500 | 改為 `NotFoundException`、`BadRequestException` |
| Email Provider 未實作 | sendgrid/smtp 選項會 fallback 到 console | 實作或從選項移除 |

## 中 (Medium)

| 項目 | 說明 | 建議 |
|------|------|------|
| 無 Rate Limiting | 登入、註冊、重發驗證可被暴力嘗試 | 加入 throttler |
| AD 啟用時註冊 | 仍可註冊本地用戶，但無法登入 | 考慮 AD 啟用時停用註冊 |
| 文件過時 | README PORT 3000 vs .env 4000 | 統一為 4000 |
| 健康檢查 | DEPLOYMENT 建議用 `/users` | 改用 `/` 或專用 health endpoint |

## 低 (Low)

| 項目 | 說明 |
|------|------|
| 測試覆蓋 | 僅 app.controller.spec，缺 auth/users 測試 |
| LoginDto 無 MinLength | 與 RegisterDto 不一致 |
| findByVerificationToken | 未檢查 verificationToken 是否為 null |

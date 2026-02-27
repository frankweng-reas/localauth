# 企業 AD 整合指南

## 概述

LocalAuth 預設使用本地密碼認證。啟用 AD 整合後，登入僅透過 AD 驗證，AD 失敗即拒絕（不 fallback 到本地）。

## 啟用步驟

### 1. 環境變數

在 `.env` 設定：

```
AD_ENABLED=true
AD_URL=ldap://ad.company.com
AD_BASE_DN=DC=company,DC=com
AD_BIND_DN=CN=service,OU=Users,DC=company,DC=com
AD_BIND_PASSWORD=your_bind_password
```

### 2. 安裝依賴

```bash
npm install ldapjs
npm install -D @types/ldapjs
```

### 3. 實作 AdAuthProvider

修改 [src/auth/providers/ad-auth.provider.ts](../src/auth/providers/ad-auth.provider.ts)：

- 注入 `UsersRepository`（首次 AD 登入需建立使用者）
- 使用 `ldapjs` 連線 AD/LDAP 驗證帳密
- 驗證成功：若 DB 無該 email，建立使用者（`passwordHash: 'AD_USER'`）
- 回傳 `User` 或 `null`

### 4. LDAP 驗證範例

```typescript
import * as ldap from 'ldapjs';

// 建立 LDAP client，bind 後搜尋用戶並驗證
const client = ldap.createClient({ url: this.configService.get('AD_URL') });
// 使用 AD_BIND_DN / AD_BIND_PASSWORD 進行 bind
// 搜尋用戶 DN，再以用戶 DN + password 進行 bind 驗證
```

### 5. 註冊功能

AD 啟用時，`POST /auth/register` 會回傳 403，註冊功能已停用。

### 6. changePassword 限制

AD 用戶（`passwordHash` 前綴 `AD_`）無法修改密碼，修改密碼應在 AD 端進行。`auth.service.ts` 的 `changePassword` 已會檢查並拒絕 AD 用戶。

### 7. 認證來源紀錄（規劃中，尚未實作）

目前以 `passwordHash` 前綴區分 AD/local。未來若需明確紀錄，可於 Prisma 新增 `authSource: 'local' | 'ad'` 欄位。

## 需修改的檔案

| 檔案 | 說明 |
|------|------|
| `src/auth/providers/ad-auth.provider.ts` | 實作 LDAP 連線與驗證 |
| `.env` | 設定 AD_ENABLED 及 AD 連線參數 |

## 登入流程

```
POST /auth/login
  → AD_ENABLED? 
    → 是: AdAuthProvider.validateCredentials → 成功 → JWT / 失敗 → 401（不 fallback）
    → 否: LocalAuthProvider.validateCredentials → 成功 → JWT / 失敗 → 401
```

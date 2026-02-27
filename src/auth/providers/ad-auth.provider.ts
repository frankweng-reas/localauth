import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAuthProvider } from './auth-provider.interface';
import { User } from '@prisma/client';

/**
 * AD (Active Directory) 驗證 Provider - 尚未實作
 * 未來需在此實作 LDAP 連線與驗證邏輯
 * 參考 docs/AD_INTEGRATION.md
 */
@Injectable()
export class AdAuthProvider implements IAuthProvider {
  constructor(private readonly configService: ConfigService) {}

  async validateCredentials(email: string, password: string): Promise<User | null> {
    // Stub: 尚未實作 LDAP 驗證，一律回傳 null
    // 實作時需：1) 連線 AD/LDAP 驗證 2) 成功則建立/取得 DB 用戶（passwordHash 用 AD_USER）
    void email;
    void password;
    void this.configService;
    return null;
  }
}

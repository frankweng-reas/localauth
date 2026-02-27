import { User } from '@prisma/client';

export const AUTH_PROVIDER = 'AUTH_PROVIDER';

export interface IAuthProvider {
  validateCredentials(email: string, password: string): Promise<User | null>;
}

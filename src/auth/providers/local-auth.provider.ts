import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../../users/users.repository';
import { IAuthProvider } from './auth-provider.interface';
import { User } from '@prisma/client';

@Injectable()
export class LocalAuthProvider implements IAuthProvider {
  constructor(private readonly usersRepository: UsersRepository) {}

  async validateCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) return null;

    // AD users have placeholder passwordHash, skip bcrypt
    if (user.passwordHash.startsWith('AD_')) return null;

    const isValid = await bcrypt.compare(password, user.passwordHash);
    return isValid ? user : null;
  }
}

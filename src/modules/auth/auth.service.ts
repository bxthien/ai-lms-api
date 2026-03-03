import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserRole, UserStatus } from '@prisma/client';
import { AuthRepository } from './repositories/auth.repository';
import { UsersRepository } from '../users/repositories/users.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersRepository.create({
      email: dto.email,
      password: hashed,
      fullName: dto.fullName,
      role: dto.role ?? UserRole.STUDENT,
      status: UserStatus.ACTIVE,
      isVerified: false,
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    const { password: _, ...safeUser } = user;
    return { user: safeUser, ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    const { password: _, ...safeUser } = user;
    return { user: safeUser, ...tokens };
  }

  async refreshTokens(dto: RefreshTokenDto) {
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET');

    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync(dto.refreshToken, {
        secret: refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersRepository.findByIdWithPassword(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const activeTokens =
      await this.authRepository.findActiveRefreshTokensByUser(user.id);

    const match = await Promise.any(
      activeTokens.map(async (token) => {
        const ok = await bcrypt.compare(dto.refreshToken, token.token);
        return ok ? token : Promise.reject(null);
      }),
    ).catch(() => null);

    if (!match) {
      throw new UnauthorizedException('Refresh token not recognized');
    }

    const newTokens = await this.generateTokens(
      user.id,
      user.email,
      user.role,
    );
    await this.storeRefreshToken(user.id, newTokens.refreshToken);

    const { password: _, ...safeUser } = user;
    return { user: safeUser, ...newTokens };
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: UserRole,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    const accessExpiresIn = this.configService.get<number>(
      'JWT_ACCESS_EXPIRES_IN',
      900,
    );
    const refreshExpiresIn = this.configService.get<number>(
      'JWT_REFRESH_EXPIRES_IN',
      604800,
    );

    const payload: JwtPayload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: accessExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hash = await bcrypt.hash(refreshToken, 10);
    const expiredAt = new Date(
      Date.now() +
        this.configService.get<number>('JWT_REFRESH_EXPIRES_IN', 604800) *
          1000,
    );
    await this.authRepository.createRefreshToken({
      token: hash,
      userId,
      expiredAt,
    });
  }
}

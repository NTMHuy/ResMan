import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }


  async register(dto: RegisterDto) {
    const username = dto.username.trim();
    const email = dto.email?.trim().toLowerCase() || null;

    // 1. Kiểm tra username hoặc email đã tồn tại
    const conditions: any[] = [
      { username },
    ];

    if (email) {
      conditions.push({ email });
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: conditions,
      },
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new ConflictException('Username đã được sử dụng');
      }

      throw new ConflictException('Email đã được sử dụng');
    }

    // 2. Tìm role CUSTOMER
    const customerRole = await this.prisma.role.findUnique({
      where: {
        code: 'CUSTOMER',
      },
    });

    if (!customerRole) {
      throw new InternalServerErrorException(
        'Chưa cấu hình role CUSTOMER trong hệ thống',
      );
    }

    // 3. Mã hóa password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // 4. Tạo tài khoản
    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        roleId: customerRole.id,
      },
      include: {
        role: true,
      },
    });

    // 5. Trả dữ liệu an toàn
    return {
      message: 'Đăng ký tài khoản thành công',
      user: {
        id: user.id.toString(),
        username: user.username,
        email: user.email,
        isActive: user.isActive,
        role: {
          id: user.role.id.toString(),
          code: user.role.code,
          name: user.role.name,
        },
      },
    };
  }


  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
      include: {
        role: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException(
        'Username hoặc password không chính xác',
      );
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Username hoặc password không chính xác',
      );
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastLoginAt: new Date(),
      },
    });

    const payload = {
      sub: user.id.toString(),
      username: user.username,
    };

    const accessToken =
      await this.jwtService.signAsync(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: '1d',
      user: {
        id: user.id.toString(),
        username: user.username,
        email: user.email,
        isActive: user.isActive,
        role: {
          id: user.role.id.toString(),
          code: user.role.code,
          name: user.role.name,
        },
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: BigInt(userId),
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
        employee: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException(
        'Tài khoản không tồn tại hoặc đã bị khóa',
      );
    }

    return {
      id: user.id.toString(),
      username: user.username,
      email: user.email,
      isActive: user.isActive,
      role: {
        id: user.role.id.toString(),
        code: user.role.code,
        name: user.role.name,
      },
      employee: user.employee
        ? {
          id: user.employee.id.toString(),
          employeeCode: user.employee.employeeCode,
          fullName: user.employee.fullName,
          phone: user.employee.phone,
        }
        : null,
      permissions: user.role.permissions.map(
        (item) => item.permission.code,
      ),
    };
  }
}
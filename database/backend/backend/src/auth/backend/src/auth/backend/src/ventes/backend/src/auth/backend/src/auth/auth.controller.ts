import {
  Controller,
  Post,
  Body,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

class LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.prisma.employe.findUnique({
      where: { email: loginDto.email },
    });

    if (!user || !bcrypt.compareSync(loginDto.password, user.password)) {
      throw new BadRequestException('Email ou mot de passe incorrect');
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      magasinId: user.magasinId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
        magasinId: user.magasinId,
      },
    };
  }
}

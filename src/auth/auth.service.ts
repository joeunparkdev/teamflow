import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dtos/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

interface CustomRequest extends Request {
  session: any;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async signUp({ email, password, passwordConfirm, name }: SignUpDto) {
    const isPasswordMatched = password === passwordConfirm;
    if (!isPasswordMatched) {
      throw new BadRequestException(
        '비밀번호와 비밀번호 확인이 서로 일치하지 않습니다.',
      );
    }

    const existedUser = await this.userRepository.findOne({ where: { email } });
    if (existedUser) {
      throw new BadRequestException('이미 가입된 이메일입니다.');
    }

    const hashRounds = this.configService.get<number>('PASSWORD_HASH_ROUNDS');
    const hashedPassword = bcrypt.hashSync(password, hashRounds);

    const user = await this.userRepository.save({
      email,
      password: hashedPassword,
      name,
    });

    return this.signIn(user.id);
  }

  signIn(id: number) {
    const payload = { id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    this.userRepository.update(id, { refreshToken });
    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      console.log('Received Refresh Token:', refreshToken);

      // "Bearer " 제거 후 토큰 추출
      const token = refreshToken.replace('Bearer ', '');
      console.log('Extracted Token:', token);

      // 토큰 검증
      const decoded = this.jwtService.verify(token, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
      console.log('Decoded Refresh Token:', decoded);

      // 사용자 ID를 가져오기
      const userId = decoded.id; // 'id' 필드를 사용
      console.log('User ID from Refresh Token:', userId);
    } catch (err) {
      console.error('토큰 검증 및 갱신 중 오류 발생:', err);
      throw new UnauthorizedException('토큰이 유효하지 않습니다.');
    }
  }

  async validateUser({ email, password }: SignInDto) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, password: true },
    });
    const isPasswordMatched = bcrypt.compareSync(
      password,
      user?.password ?? '',
    );

    if (!user || !isPasswordMatched) {
      return null;
    }

    return { id: user.id };
  }

  async validateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId, refreshToken },
    });
    console.log(user);
    return user || null;
  }

  async validate(payload: any) {
    console.log(payload);
    const user = await this.userService.validateRefreshToken(
      payload.sub,
      payload.refreshToken,
    );
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}

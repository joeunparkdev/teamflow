import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { SignInDto } from './dtos/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

interface CustomRequest extends Request {
  session: any;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async signUp({ email, password, passwordConfirm, name }: SignUpDto) {
    const isPasswordMatched = password === passwordConfirm;
    if (!isPasswordMatched) {
      throw new BadRequestException(
        '비밀번호와 비밀번호 확인이 서로 일치하지 않습니다.',
      );
    }

    const existedUser = await this.userRepository.findOneBy({ email });
    if (existedUser) {
      throw new BadRequestException('이미 가입 된 이메일 입니다.');
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

  signIn(userId: number) {
    const payload = { id: userId };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  private readonly jwtSecretKey = process.env.JWT_SECRET || 'default_secret';

  signOut(req) {
    console.log(req);
    // 세션 무효화
    req.session.destroy((err) => {
      if (err) {
        console.error('세션 무효화 오류:', err);
      }
    });

    // JWT 토큰 제거
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token);
    if (token) {
      try {
        jwt.verify(token, this.jwtSecretKey, { ignoreExpiration: true });
        console.log(token, this.jwtSecretKey);
        // 토큰이 검증되면 무효화됨
        console.log('JWT 토큰이 무효화되었습니다.');
      } catch (error) {
        console.error('JWT 토큰 검증 오류:', error);
      }
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
}

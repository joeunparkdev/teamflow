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
import { ColumnStatus } from 'src/enums/columns-status.enum';
import { UserStatus } from 'src/enums/user-status.enum';


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
    const payload = { id};
    const accessToken = this.jwtService.sign(payload, {secret: process.env.JWT_SECRET});
    const refreshToken = this.jwtService.sign(payload,  { secret: process.env.REFRESH_SECRET, expiresIn: '7d' });
    this.userRepository.update(id, { refreshToken });
    return { accessToken, refreshToken };
  }

  async refreshToken(userId: number, token: string) {
    await this.validate(userId, token);
    return this.signIn(userId);
  }

  private generateAccessToken(userId: number): string {
    const accessToken = this.jwtService.sign({ id: userId });
    return accessToken;
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

  async validaterefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId, refreshToken },
    });
    console.log(user);
    console.log(userId);
    console.log(refreshToken);
    return user || null;
  }

  async validate(userId: number, refreshToken: string) {
    const user = await this.validaterefreshToken(
      userId,
      refreshToken,
    );
    console.log(user);
    console.log(userId);
    console.log(refreshToken);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async updateUserToInactive(email: string): Promise<void> {
    await this.userRepository.update({ email }, { status: UserStatus.Inactive});
  }
}

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import { promisify } from 'util';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailVerification } from '../email/entities/email.entity';
import { AuthService } from 'src/auth/auth.service';

const randomBytesAsync = promisify(randomBytes);

@Injectable()
export class EmailService {
  
  private authService: AuthService; 

  private transporter;
  private readonly MAX_ATTEMPTS = 3;
  private readonly EXPIRY_DURATION = 3 * 60 * 1000; // 3분

  constructor(
    @InjectRepository(EmailVerification)
    private readonly emailVerificationRepository: Repository<EmailVerification>,
  ) {
    // 이메일 전송을 위한 transporter 설정
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // 발신자 이메일
        pass: process.env.EMAIL_PASS, // 발신자 이메일 비밀번호
      },
    });
  }

  async sendEmail(email: string, subject: string, text: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER, // 발신자 이메일
      to: email,
      subject: subject,
      text: text,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async generateVerificationCode(
    email: string,
  ): Promise<{ code: string; expiry: number; remainingTime?: number }> {
    const existingCode = await this.emailVerificationRepository.findOne({
      where: { email },
    });

    if (existingCode) {
      if (
        existingCode.attempts >= this.MAX_ATTEMPTS ||
        Date.now() > existingCode.expiry
      ) {
        // 회원이 허용된 시도 횟수를 초과하거나, 인증번호의 유효 기간이 지났을 경우
        this.emailVerificationRepository.delete({ email });
      } else {
        // 이미 생성된 인증번호가 있고, 시도 횟수가 허용 범위 내에 있을 경우 기존 코드를 반환
        const remainingTime = Math.max(
          0,
          Math.ceil((existingCode.expiry - Date.now()) / 1000),
        ); // 남은 시간 (초)
        return {
          code: existingCode.code,
          expiry: existingCode.expiry,
          remainingTime,
        };
      }
    }

    const verificationCode = (await randomBytesAsync(6)).toString('hex');
    const expiry = Date.now() + this.EXPIRY_DURATION;

    // 데이터베이스에 저장
    await this.emailVerificationRepository.save({
      email,
      code: verificationCode,
      expiry,
    });

    const remainingTime = Math.max(0, Math.ceil((expiry - Date.now()) / 1000)); // 남은 시간 (초)
    return { code: verificationCode, expiry, remainingTime };
  }

  async verifyCode(email: string, code: string): Promise<boolean> {
    const savedCode = await this.emailVerificationRepository.findOne({
      where: { email },
    });

    // 인증번호가 일치하고, 유효 기간 내에 있는 경우
    if (
      savedCode &&
      savedCode.code === code &&
      Date.now() <= savedCode.expiry
    ) {
      // 기존에 저장된 인증번호 삭제
      this.emailVerificationRepository.delete({ email });
      return true;
    }

    // 인증번호가 일치하지 않거나, 유효 기간이 지났을 경우
    if (savedCode) {
      savedCode.attempts += 1;

      // 시도 횟수가 허용 범위를 초과하면 회원을 휴면 상태로 전환
      if (savedCode.attempts >= this.MAX_ATTEMPTS) {
        console.log(
          `User with email ${email} exceeded maximum verification attempts.`,
        );
        // 휴먼 계정 전환
        await this.authService.updateUserToInactive(email);
      }
    }

    return false;
  }

  async sendVerificationEmail(
    email: string,
    verificationCodeData: {
      code: string;
      expiry: number;
      remainingTime?: number;
      timer?: NodeJS.Timeout;
    },
  ) {
    try {
      const { code, expiry, remainingTime, timer } = verificationCodeData;

      const subject = '비밀번호 재설정을 위한 인증 코드';
      const text = `인증 번호: ${code}`;

      await this.sendEmail(email, subject, text);

      return {
        statusCode: 200,
        message: '이메일 인증 코드를 전송했습니다.',
      };
    } catch (error) {
      console.error('Error sending verification email:', error);
      return {
        statusCode: 500,
        message: '이메일 인증 코드 전송 중 오류가 발생했습니다.',
      };
    }
  }
}

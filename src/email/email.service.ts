import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
  private readonly max_attempts = 3;
  private readonly expiry_duration = 3 * 60 * 1000; // 3분

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
  ): Promise<{ code: string; expiry: Date; remainingTime?: number }> {
    let verificationCode: string;
    let expiry: Date;

    const existingCode = await this.emailVerificationRepository.findOne({
      where: { email },
    });

    if (existingCode) {
      if (
        existingCode.attempts >= this.max_attempts ||
        Date.now() > existingCode.expiry.getTime()
      ) {
        // 기존 코드가 있지만 유효하지 않을 경우 삭제
        await this.emailVerificationRepository.delete({ email });
      } else {
        // 이미 생성된 인증번호가 있고, 시도 횟수가 허용 범위 내에 있을 경우 기존 코드를 반환
        expiry = existingCode.expiry;
        const remainingTime = Math.max(
          0,
          Math.ceil((expiry.getTime() - Date.now()) / 1000),
        );
        return { code: existingCode.code, expiry, remainingTime };
      }
    }

    // 기존 코드가 없거나 유효하지 않을 경우 새로운 코드 생성
    verificationCode = (await randomBytesAsync(6)).toString('hex');
    expiry = new Date();
    expiry.setTime(expiry.getTime() + this.expiry_duration);

    // 데이터베이스에 저장
    await this.emailVerificationRepository.save({
      email,
      code: verificationCode,
      expiry,
    });

    const remainingTime = Math.max(
      0,
      Math.ceil((expiry.getTime() - Date.now()) / 1000),
    );
    return { code: verificationCode, expiry, remainingTime };
  }

  async sendVerificationEmail(
    email: string,
  ): Promise<{ code: string; expiry: Date; remainingTime?: number }> {
    const { code, expiry } = await this.generateVerificationCode(email);
    const subject = '이메일 인증 번호';
    const remainingTime = Math.max(
      0,
      Math.ceil((expiry.getTime() - Date.now()) / 1000),
    );
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER, // 발신자 이메일
        to: email,
        subject: subject,
        text: code,
      };

      try {
        const info = await this.transporter.sendMail(mailOptions);
      } catch (error) {
        console.error('Error sending email:', error);
      }

      await this.emailVerificationRepository.save({
        email,
        code,
        expiry,
      });
      return { code, expiry, remainingTime };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // 중복된 이메일 주소로 인한 예외 처리
        console.error(`Duplicate entry error for email: ${email}`);
        console.error('Duplicate Entry Error Details:', error);
        // 이미 존재하는 코드로 대체
        const existingCode = await this.emailVerificationRepository.findOne({
          where: { email },
        });
        return {
          code: existingCode.code,
          expiry: existingCode.expiry,
          remainingTime,
        };
      }
      // 다른 예외는 다시 throw
      throw error;
    }
  }

  async verifyCode(email: string, code: string): Promise<boolean> {
    const savedCode = await this.emailVerificationRepository.findOne({
      where: { email },
    });

    // 인증번호가 일치하고, 유효 기간 내에 있는 경우
    if (
      savedCode &&
      savedCode.code === code &&
      (await this.isValidExpiration(savedCode.expiry))
    ) {
      // 기존에 저장된 인증번호 삭제
      await this.emailVerificationRepository.delete({ email });
      return true;
    }

    // 인증번호가 일치하지 않거나, 유효 기간이 지났을 경우
    if (savedCode) {
      savedCode.attempts += 1;
      await this.emailVerificationRepository.save(savedCode);

      // 시도 횟수가 허용 범위를 초과하면 회원을 휴면 상태로 전환
      if (savedCode.attempts >= this.max_attempts) {
        console.log(
          `User with email ${email} exceeded maximum verification attempts.`,
        );
        // 휴먼 계정 전환
        await this.authService.updateUserToInactive(email);
      }
    }

    return false;
  }

  async isValidExpiration(expiration: Date): Promise<boolean> {
    const currentDateTime = new Date();
    return expiration > currentDateTime;
  }
}
